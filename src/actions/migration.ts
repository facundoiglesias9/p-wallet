'use server';

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function migrateOldDataToCurrentUser() {
    const session = await verifySession();
    if (!session?.userId) return { error: 'No autorizado' };

    const newUserId = session.userId;

    // Asumimos que los datos viejos pertenecían a cualquier usuario que NO sea el actual
    // Opcionalmente, podriamos filtrar por un ID específico si lo conocieramos,
    // pero en este caso queremos "traer todo lo que había".

    try {
        // 1. Migrar Gastos
        const expenses = await prisma.expense.updateMany({
            where: { userId: { not: newUserId } },
            data: { userId: newUserId }
        });

        // 2. Migrar Ingresos
        const incomes = await prisma.income.updateMany({
            where: { userId: { not: newUserId } },
            data: { userId: newUserId }
        });

        // 3. Migrar Planes de Gastos
        const plans = await prisma.expensePlan.updateMany({
            where: { userId: { not: newUserId } },
            data: { userId: newUserId }
        });

        // 4. Migrar Personas (Deudas/Convivencia)
        // Nota: Si hay conflictos de nombres, esto podría ser delicado, pero asumimos single-user previo.
        const people = await prisma.person.updateMany({
            where: { userId: { not: newUserId } },
            data: { userId: newUserId }
        });

        // 5. Categorías de pagos recurrentes
        const catPayments = await prisma.categoryPayment.updateMany({
            where: { userId: { not: newUserId } },
            data: { userId: newUserId }
        });

        // 6. Ahorros
        const savings = await prisma.saving.updateMany({
            where: { userId: { not: newUserId } },
            data: { userId: newUserId }
        });

        // 7. Ingresos Recurrentes
        const recurringIncomes = await prisma.recurringIncome.updateMany({
            where: { userId: { not: newUserId } },
            data: { userId: newUserId }
        });


        console.log(`Migración completada: ${expenses.count} gastos, ${incomes.count} ingresos migrados.`);

        revalidatePath('/');
        revalidatePath('/expenses');
        revalidatePath('/plans');
        revalidatePath('/settings');

        return {
            success: true,
            message: `Datos recuperados: ${expenses.count} gastos, ${plans.count} planes.`
        };

    } catch (error) {
        console.error("Error en migración:", error);
        return { error: 'Error al migrar datos. Revisa la consola.' };
    }
}
