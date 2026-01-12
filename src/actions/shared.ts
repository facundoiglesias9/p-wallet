'use server';

import prisma from '@/lib/prisma';

import { verifySession } from '@/lib/session';

export async function getSharedData(month?: number, year?: number) {
    const session = await verifySession();
    const userId = session?.userId as string;

    if (!userId) return { oneTimePeople: [], cohabitants: [], cohabitantStats: { totalPool: 0, myTotalContribution: 0, othersContribution: 0 }, expenses: [] };

    const isAllTime = month === -1;
    const m = month !== undefined && month !== -1 ? month : 0;
    const y = year !== undefined ? year : 2026;

    const startOfMonth = new Date(y, m, 1);
    const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59);

    // Incomes for the user
    let userIncomes: any[] = [];

    try {
        // Fetch all people
        let people: any[] = [];
        try {
            people = await prisma.$queryRaw`SELECT * FROM Person WHERE userId = ${userId}` as any[];
        } catch (e) {
            console.error("Failed to fetch People", e);
            return { oneTimePeople: [], cohabitants: [], cohabitantStats: { totalPool: 0, myTotalContribution: 0, othersContribution: 0 }, expenses: [] };
        }

        let expenses: any[] = [];
        try {
            if (isAllTime) {
                // Fetch ALL shared expenses for this user
                expenses = await prisma.$queryRaw`
                    SELECT * FROM Expense 
                    WHERE (isShared = 1 OR isShared = true) 
                    AND userId = ${userId} 
                    ORDER BY date DESC
                ` as any[];
            } else {
                // Filter by month/year matching the Expenses page logic
                expenses = await prisma.$queryRaw`
                    SELECT * FROM Expense 
                    WHERE (isShared = 1 OR isShared = true) 
                    AND userId = ${userId} 
                    AND (
                        (date >= ${startOfMonth} AND date <= ${endOfMonth})
                        OR
                        (type = 'SUBSCRIPTION' AND date <= ${endOfMonth})
                    )
                    ORDER BY date DESC
                ` as any[];
            }
        } catch (e) {
            console.error("Failed to fetch Expenses", e);
            return { oneTimePeople: [], cohabitants: [], cohabitantStats: { totalPool: 0, myTotalContribution: 0, othersContribution: 0 }, expenses: [] };
        }

        // Now we need the participants for these expenses.
        let expenseParticipants: any[] = [];
        try {
            expenseParticipants = await prisma.$queryRaw`SELECT * FROM _ExpenseToPerson` as any[];
        } catch (e) {
            console.warn("Could not query implicit table _ExpenseToPerson");
        }

        // Map participants to expenses
        expenses = expenses.map(e => {
            const related = expenseParticipants
                .filter(ep => ep.A === e.id)
                .map(ep => {
                    return people.find(p => p.id === ep.B);
                })
                .filter(Boolean);

            return {
                ...e,
                participants: related
            };
        });

        // Initialize stats for each cohabitant
        const individualStats: Record<string, {
            id: string,
            name: string,
            totalContributed: number,
            idealShare: number,
            balance: number,
            history: any[]
        }> = {};

        people.filter(p => p.role === 'COHABITANT').forEach(p => {
            individualStats[p.id] = {
                id: p.id,
                name: p.name,
                totalContributed: 0,
                idealShare: 0,
                balance: 0,
                history: []
            };
        });

        // Add 'me' (the user) as an implicit participant in cohabitation
        const MY_ID = 'me';
        individualStats[MY_ID] = {
            id: MY_ID,
            name: 'Yo',
            totalContributed: 0,
            idealShare: 0,
            balance: 0,
            history: []
        };

        const cohabitantStats = {
            totalPool: 0,
            myTotalContribution: 0,
            othersContribution: 0
        };

        const debts: Record<string, number> = {};
        people.forEach(p => debts[p.id] = 0);
        const debtDetails: Record<string, any[]> = {};

        expenses.forEach(expense => {
            const expenseAmount = expense.amount;
            const payerId = expense.paidBy; // "me" or UUID

            let participants = expense.participants || [];

            // Fallback: If shared but no participants linked, assume it's shared with ALL Cohabitants
            if (participants.length === 0) {
                participants = people.filter(p => p.role === 'COHABITANT');
            }

            if (participants.length === 0) return;

            // Simple divide by (participants + 1 for user)
            const totalParticipants = participants.length + 1;
            const sharePerPerson = expenseAmount / totalParticipants;

            // Track cohabitation pool stats separately
            const isCohabitationExpense = participants.some((p: any) => p.role === 'COHABITANT');

            if (isCohabitationExpense) {
                cohabitantStats.totalPool += expenseAmount;

                // Track contribution
                if (payerId === 'me' || payerId === MY_ID) {
                    cohabitantStats.myTotalContribution += expenseAmount;
                    individualStats[MY_ID].totalContributed += expenseAmount;
                } else if (individualStats[payerId]) {
                    cohabitantStats.othersContribution += expenseAmount;
                    individualStats[payerId].totalContributed += expenseAmount;
                }

                // Track historical share and Ideal Share
                participants.forEach((p: any) => {
                    if (p.role === 'COHABITANT' && individualStats[p.id]) {
                        individualStats[p.id].idealShare += sharePerPerson;
                    }
                });
                individualStats[MY_ID].idealShare += sharePerPerson;
            }

            // General Debt logic (stays as backup for one-time people)
            if (payerId === 'me' || payerId === MY_ID) {
                participants.forEach((p: any) => {
                    debts[p.id] = (debts[p.id] || 0) + sharePerPerson;
                    if (p.role !== 'COHABITANT') {
                        if (!debtDetails[p.id]) debtDetails[p.id] = [];
                        debtDetails[p.id].push({
                            id: expense.id,
                            description: expense.description,
                            date: expense.date,
                            amount: sharePerPerson,
                            totalAmount: expenseAmount
                        });
                    }
                });
            } else {
                const payer = people.find(p => p.id === payerId);
                if (payer) {
                    // I owe the payer my share
                    debts[payerId] = (debts[payerId] || 0) - sharePerPerson;

                    if (payer.role !== 'COHABITANT') {
                        if (!debtDetails[payerId]) debtDetails[payerId] = [];
                        debtDetails[payerId].push({
                            id: expense.id,
                            description: expense.description,
                            date: expense.date,
                            amount: -sharePerPerson,
                            totalAmount: expenseAmount
                        });
                    }
                }
            }
        });

        // Finalize cohabitant balances: Contribution - IdealShare
        // Positive: They paid more than they consumed (Te deben/Se les debe)
        // Negative: They consumed more than they paid (Deben)
        const cohabitants = people
            .filter(p => p.role === 'COHABITANT')
            .map(p => {
                const stat = individualStats[p.id];
                const balance = stat.totalContributed - stat.idealShare;
                // Note: This balance is relative to the pool.
                // In a many-person context, we often resolve balances against the "central pool" or pairwise.
                // For simplicity, we keep showing what they owe/are owed compared to the average.
                return {
                    ...p,
                    totalContributed: stat.totalContributed,
                    idealShare: stat.idealShare,
                    balance: balance
                };
            });

        const myStats = {
            totalContributed: individualStats[MY_ID].totalContributed,
            idealShare: individualStats[MY_ID].idealShare,
            balance: individualStats[MY_ID].totalContributed - individualStats[MY_ID].idealShare
        };

        const oneTimePeople = people
            .filter(p => p.role !== 'COHABITANT')
            .map(p => ({
                ...p,
                balance: debts[p.id] || 0,
                history: debtDetails[p.id] || []
            }));

        // Fetch current user name
        // Fetch current user name
        const userRec = await prisma.$queryRaw`SELECT username FROM "User" WHERE id = ${userId}` as any[];
        const dbName = userRec[0]?.username;
        // If dbName is the generated ID (starts with user_), fallback to 'Yo'
        const currentUserName = (dbName && !dbName.startsWith('user_')) ? dbName : 'Yo';

        return {
            oneTimePeople,
            cohabitants,
            cohabitantStats: {
                ...cohabitantStats,
                myStats: {
                    ...myStats,
                    name: currentUserName
                }
            },
            expenses
        };

    } catch (e) {
        console.error("Error getting shared data", e);
        return {
            oneTimePeople: [],
            cohabitants: [],
            cohabitantStats: {
                totalPool: 0,
                myTotalContribution: 0,
                othersContribution: 0,
                myStats: { totalContributed: 0, idealShare: 0, balance: 0 }
            },
            expenses: []
        };
    }
}
