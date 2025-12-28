'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/session';

export async function createSaving(formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const currency = formData.get('currency') as string;
    const description = formData.get('description') as string;
    const dateStr = formData.get('date') as string;

    // Default to current date if not provided
    const date = dateStr ? new Date(dateStr) : new Date();

    const session = await verifySession();
    const userId = session?.userId as string;

    await prisma.saving.create({
        data: {
            amount,
            currency,
            description,
            date,
            userId
        }
    });

    revalidatePath('/savings');
    revalidatePath('/');
}

export async function deleteSaving(id: string) {
    const session = await verifySession();
    const userId = session?.userId as string;

    await prisma.saving.deleteMany({
        where: { id, userId }
    });

    revalidatePath('/savings');
    revalidatePath('/');
}

export async function getSavings(year?: number) {
    const session = await verifySession();
    const userId = session?.userId as string;

    if (!userId) return [];

    try {
        // Raw SQL fallback to avoid Prisma Client validation errors (stale schema)
        // Adjust column selection as needed, though SELECT * usually works fine with SQLite
        if (year) {
            const start = new Date(year, 0, 1).toISOString();
            const end = new Date(year, 11, 31, 23, 59, 59).toISOString();
            return await prisma.$queryRaw`
                SELECT * FROM Saving 
                WHERE userId = ${userId} 
                AND date >= ${start} 
                AND date <= ${end} 
                ORDER BY date DESC
             ` as any[];
        } else {
            return await prisma.$queryRaw`
                SELECT * FROM Saving 
                WHERE userId = ${userId} 
                ORDER BY date DESC
             ` as any[];
        }
    } catch (e) {
        console.error("Failed to get savings raw:", e);
        return [];
    }
}
