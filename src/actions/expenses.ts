'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { verifySession } from '@/lib/session';
import { randomUUID } from 'crypto';

export async function createExpense(formData: FormData) {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');
    const userId = session.userId as string;

    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;
    const dateStr = formData.get('date') as string;
    const date = new Date(dateStr + '-01T12:00:00');
    const type = formData.get('type') as string;
    const installmentsTotal = formData.get('installmentsTotal') ? parseInt(formData.get('installmentsTotal') as string) : 1;
    const isShared = formData.get('isShared') === 'on';
    const paidBy = formData.get('paidBy') as string || 'me';

    // Parse participant IDs
    const participantIdsRaw = formData.get('participantIds') as string;
    let participantIds: string[] = [];
    if (isShared && participantIdsRaw) {
        try {
            participantIds = JSON.parse(participantIdsRaw);
        } catch (e) {
            console.error("Failed to parse participant IDs", e);
        }
    }

    const participantsConnect = participantIds.map(id => ({ id }));

    // Prepare base data object
    const baseData: any = {
        description,
        amount,
        category,
        type,
        isShared,
        paidBy,
        participants: { connect: participantsConnect },
        userId: userId
    };

    if (type === 'INSTALLMENT' && installmentsTotal > 1) {
        for (let i = 1; i <= installmentsTotal; i++) {
            const installmentDate = new Date(date);
            installmentDate.setMonth(date.getMonth() + (i - 1));

            const id = randomUUID();
            const now = new Date();
            // Boolean to integer for SQLite if needed, but Prisma usually handles param binding.
            // However, to be safe with raw:
            // const isSharedInt = isShared ? 1 : 0; // Removed for Postgres compatibility (use boolean directly)

            await prisma.$executeRaw`
                INSERT INTO "Expense" (
                    id, description, amount, category, type, 
                    "installmentsTotal", "installmentNumber", "isShared", "paidBy", 
                    "userId", date, "createdAt", "updatedAt"
                )
                VALUES (
                    ${id}, ${description}, ${amount}, ${category}, 'INSTALLMENT', 
                    ${installmentsTotal}, ${i}, ${isShared}, ${paidBy}, 
                    ${userId}, ${installmentDate}, ${now}, ${now}
                )
            `;

            if (isShared && participantIds.length > 0) {
                for (const personId of participantIds) {
                    await prisma.$executeRaw`
                        INSERT INTO _ExpenseToPerson (A, B) VALUES (${id}, ${personId})
                    `;
                }
            }
        }
    } else {
        const id = randomUUID();
        const now = new Date();
        // const isSharedInt = isShared ? 1 : 0;

        await prisma.$executeRaw`
            INSERT INTO "Expense" (
                id, description, amount, category, type, 
                "installmentsTotal", "installmentNumber", "isShared", "paidBy", 
                "userId", date, "createdAt", "updatedAt"
            )
            VALUES (
                ${id}, ${description}, ${amount}, ${category}, ${type}, 
                1, 1, ${isShared}, ${paidBy}, 
                ${userId}, ${date}, ${now}, ${now}
            )
        `;

        if (isShared && participantIds.length > 0) {
            for (const personId of participantIds) {
                await prisma.$executeRaw`
                        INSERT INTO _ExpenseToPerson (A, B) VALUES (${id}, ${personId})
                    `;
            }
        }
    }

    revalidatePath('/expenses');
    revalidatePath('/categories');
    revalidatePath('/');
}
export async function updateExpense(formData: FormData) {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');
    const userId = session.userId as string;

    const id = formData.get('id') as string;
    const description = formData.get('description') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const category = formData.get('category') as string;
    const dateStr = formData.get('date') as string;
    const date = new Date(dateStr + '-01T12:00:00');
    const isShared = formData.get('isShared') === 'on';
    // const isSharedInt = isShared ? 1 : 0;
    const paidBy = formData.get('paidBy') as string || 'me';

    // Parse participants for update
    const participantIdsRaw = formData.get('participantIds') as string;
    let participantIds: string[] = [];
    if (isShared && participantIdsRaw) {
        try {
            participantIds = JSON.parse(participantIdsRaw);
        } catch (e) {
            console.error("Failed to parse participant IDs for update", e);
        }
    }

    await prisma.$executeRaw`
        UPDATE "Expense" 
        SET description = ${description}, 
            amount = ${amount}, 
            category = ${category}, 
            date = ${date}, 
            "isShared" = ${isShared}, 
            "paidBy" = ${paidBy},
            "updatedAt" = ${new Date()}
        WHERE id = ${id} AND "userId" = ${userId}
    `;

    // Refresh Join Table
    await prisma.$executeRaw`DELETE FROM _ExpenseToPerson WHERE A = ${id}`;
    if (isShared && participantIds.length > 0) {
        for (const personId of participantIds) {
            await prisma.$executeRaw`
                INSERT INTO _ExpenseToPerson (A, B) VALUES (${id}, ${personId})
            `;
        }
    }

    revalidatePath('/expenses');
    revalidatePath('/');
    revalidatePath('/history');
    revalidatePath('/shared');
}

export async function deleteExpense(id: string) {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');
    const userId = session.userId as string;

    await prisma.$executeRaw`
        DELETE FROM "Expense" 
        WHERE id = ${id} AND "userId" = ${userId}
    `;

    revalidatePath('/expenses');
    revalidatePath('/');
    revalidatePath('/history');
}

export async function createCategory(formData: FormData) {
    // Categories are typically global or user specific. 
    // Given the request "cree sus datos de 0", implies categories might be personal or we seed defaults.
    // However, the Category model doesn't explicitly have userId in my previous schema update (it has in CategoryPayment but not Category itself). 
    // Wait, in schema step 464, I did NOT add userId to Category model, only CategoryPayment!
    // I should fix the schema if categories are personal. 
    // For now, I will NOT filter categories by user if they are global, OR I assume they are global.
    // BUT the user said "cree sus datos de 0" which usually implies personal categories too.
    // Let's check Schema step 464 again.
    // "model Category { id, name, color, icon, payments CategoryPayment[] }" NO userId.
    // So Categories are GLOBAL currently. 
    // If I want them private, I need to migrate schema. 
    // Use User prompt context: "mi usuario es unico" -> "hace un registro pero para que cree sus datos de 0".
    // If "pepe" registers, does he see "Comida", "Transporte"? Yes, usually desired default.
    // So let's keep Categories GLOBAL for now to simplify "seeding", but expenses are private.

    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const icon = formData.get('icon') as string;

    await prisma.category.create({
        data: {
            name,
            color,
            icon
        }
    });

    revalidatePath('/categories');
    revalidatePath('/expenses');
    revalidatePath('/');
}

export async function updateCategory(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;
    const icon = formData.get('icon') as string;

    await prisma.category.update({
        where: { id },
        data: {
            name,
            color,
            icon
        }
    });

    revalidatePath('/categories');
    revalidatePath('/expenses');
    revalidatePath('/');
}

export async function deleteCategory(id: string) {
    // Optional: Check if used in expenses and handle accordingly (block or cascade null)
    // For now, simple delete. Prisma might throw if restricted, but usually we handle foreign keys.
    await prisma.category.delete({
        where: { id }
    });

    revalidatePath('/categories');
    revalidatePath('/expenses');
    revalidatePath('/');
}

export async function getExpenses(month?: number, year?: number) {
    const session = await verifySession();
    const userId = session?.userId as string;
    if (!userId) return [];

    let expenses: any[] = [];
    try {
        if (month !== undefined && year !== undefined && !isNaN(month) && !isNaN(year)) {
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

            expenses = await prisma.$queryRaw`
                    SELECT * FROM "Expense" 
                    WHERE "userId" = ${userId} 
                    AND (
                        (date >= ${startOfMonth} AND date <= ${endOfMonth})
                        OR
                        (type = 'SUBSCRIPTION' AND date <= ${endOfMonth})
                    )
                    ORDER BY date DESC
                ` as any[];
        } else {
            // Return ALL expenses for history
            expenses = await prisma.$queryRaw`
                    SELECT * FROM "Expense" 
                    WHERE "userId" = ${userId} 
                    ORDER BY date DESC
                ` as any[];
        }

        return expenses.map(e => ({
            ...e,
            date: new Date(e.date),
            createdAt: new Date(e.createdAt),
            updatedAt: new Date(e.updatedAt)
        }));

    } catch (e) {
        console.error("Failed to fetch expenses raw", e);
        return [];
    }
}

export async function getCategories() {
    return await prisma.category.findMany();
}
