'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { randomUUID } from 'crypto';

import { verifySession } from '@/lib/session';

export async function createPerson(formData: FormData) {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');
    const userId = session.userId as string;

    const name = formData.get('name') as string;
    const role = (formData.get('role') as string) || 'ONETIME';

    if (name) {
        try {
            // Check if prisma.person is available (generated client updated)
            if ((prisma as any).person) {
                await prisma.person.create({
                    data: { name, role, userId }
                });
            } else {
                // Fallback to raw query
                const id = randomUUID();
                const now = new Date().toISOString();
                // We use current time.
                await prisma.$executeRaw`INSERT INTO Person (id, name, role, createdAt, updatedAt, userId) VALUES (${id}, ${name}, ${role}, ${now}, ${now}, ${userId})`;
            }
        } catch (e) {
            console.error("Error creating person:", e);
        }
        revalidatePath('/settings');
        revalidatePath('/expenses');
        revalidatePath('/');
    }
}

export async function deletePerson(formData: FormData) {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');
    const userId = session.userId as string;

    const id = formData.get('id') as string;
    try {
        if ((prisma as any).person) {
            // In Prisma deleteMany we can use filter
            await prisma.person.deleteMany({
                where: { id, userId }
            });
        } else {
            await prisma.$executeRaw`DELETE FROM Person WHERE id = ${id} AND userId = ${userId}`;
        }
    } catch (e) {
        console.error("Error deleting person:", e);
    }
    revalidatePath('/settings');
    revalidatePath('/expenses');
    revalidatePath('/');
}

export async function getPeople() {
    const session = await verifySession();
    const userId = session?.userId as string; // Allow public? No, strictly private.

    if (!userId) return [];

    try {
        // Fallback to raw query if prisma.person is undefined due to generation locks
        return await prisma.$queryRaw`SELECT * FROM Person WHERE userId = ${userId} ORDER BY createdAt ASC` as any[];
    } catch (e) {
        console.error("Error fetching people:", e);
        return [];
    }
}

export async function getAllAccounts() {
    try {
        return await prisma.$queryRaw`SELECT * FROM User ORDER BY createdAt DESC` as any[];
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function deleteAccount(formData: FormData) {
    const session = await verifySession();
    const adminId = 'user_facundo'; // Fixed ID for facundo

    // Authorization Check: Must be facundo
    if (session?.userId !== adminId) {
        throw new Error('Unauthorized: Only admin can delete accounts');
    }

    const targetUserId = formData.get('id') as string;
    if (!targetUserId) return;

    // Prevention: Cannot delete self (admin)
    if (targetUserId === adminId) return;

    try {
        // Force Raw execution to bypass potential Prisma Client generation EPERM errors
        // Delete children first to satisfy foreign key constraints (if any hard constraints exist in DB layer)

        await prisma.$executeRaw`DELETE FROM Expense WHERE userId = ${targetUserId}`;
        await prisma.$executeRaw`DELETE FROM Income WHERE userId = ${targetUserId}`;
        await prisma.$executeRaw`DELETE FROM Person WHERE userId = ${targetUserId}`;
        await prisma.$executeRaw`DELETE FROM CategoryPayment WHERE userId = ${targetUserId}`;

        // Final blow
        await prisma.$executeRaw`DELETE FROM User WHERE id = ${targetUserId}`;

    } catch (e) {
        console.error("Failed to delete account raw", e);
        // If raw fails, fallback to client (unlikely to work if raw failed, but consistency)
        try {
            if ((prisma as any).expense) {
                await prisma.expense.deleteMany({ where: { userId: targetUserId } });
                await prisma.income.deleteMany({ where: { userId: targetUserId } });
                await prisma.person.deleteMany({ where: { userId: targetUserId } });
                await prisma.categoryPayment.deleteMany({ where: { userId: targetUserId } });
                await prisma.user.delete({ where: { id: targetUserId } });
            }
        } catch (inner) {
            console.error("Client fallback also failed", inner);
        }
    }

    revalidatePath('/settings');
}
