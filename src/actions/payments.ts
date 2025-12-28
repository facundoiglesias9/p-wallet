'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { verifySession } from '@/lib/session';

export async function toggleCategoryPaid(categoryId: string, month: number, year: number, currentStatus: boolean) {
    const session = await verifySession();
    if (!session?.userId) throw new Error('Unauthorized');
    const userId = session.userId as string;

    try {
        // Upsert logic: if exists, update. if not, create.
        const existing = await prisma.categoryPayment.findUnique({
            where: {
                categoryId_month_year: {
                    categoryId,
                    month,
                    year
                }
            }
        });

        if (existing) {
            await prisma.categoryPayment.update({
                where: { id: existing.id },
                data: { isPaid: !existing.isPaid }
            });
        } else {
            await prisma.categoryPayment.create({
                data: {
                    categoryId,
                    month,
                    year,
                    isPaid: true,
                    userId
                }
            });
        }

    } catch (e) {
        console.error("Error toggling category paid status", e);
        // Fallback for EPERM issue using raw query if client isn't ready
        try {
            const newStatus = !currentStatus ? 1 : 0;
            // Try to update using raw SQL as backup if Prisma client is stuck
            // Complex upsert in raw SQL logic omitted for brevity, assuming standard flow works or re-try.
            // But actually, we need a robust fallback.
            const now = new Date().toISOString();
            const id = crypto.randomUUID();
            const existingCheck: any[] = await prisma.$queryRaw`SELECT * FROM CategoryPayment WHERE categoryId = ${categoryId} AND month = ${month} AND year = ${year}`;

            if (existingCheck.length > 0) {
                const currentRawPaid = existingCheck[0].isPaid;
                const newRawPaid = currentRawPaid ? 0 : 1;
                await prisma.$executeRaw`UPDATE CategoryPayment SET isPaid = ${newRawPaid} WHERE id = ${existingCheck[0].id}`;
            } else {
                await prisma.$executeRaw`INSERT INTO CategoryPayment (id, categoryId, month, year, isPaid, createdAt, updatedAt, userId) VALUES (${id}, ${categoryId}, ${month}, ${year}, 1, ${now}, ${now}, ${userId})`;
            }
        } catch (rawError) {
            console.error("Raw fallback failed too", rawError);
        }
    }

    revalidatePath('/payments');
    revalidatePath('/');
}
