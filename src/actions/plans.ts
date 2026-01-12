'use server';
// Refresh TS types

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function getPlans() {
    const session = await verifySession();
    if (!session) return [];

    return await prisma.expensePlan.findMany({
        where: { userId: session.userId as string },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createPlan(formData: FormData) {
    const session = await verifySession();
    if (!session) return { error: 'No autorizado' };

    const name = formData.get('name') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const installments = parseInt(formData.get('installments') as string) || 1;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;

    if (!name || isNaN(amount)) {
        return { error: 'Datos inválidos' };
    }

    await prisma.expensePlan.create({
        data: {
            userId: session.userId as string,
            name,
            amount,
            installments,
            description,
            link
        }
    });

    revalidatePath('/plans');
    return { success: true };
}

export async function deletePlan(id: string) {
    const session = await verifySession();
    if (!session) return;

    await prisma.expensePlan.deleteMany({
        where: {
            id,
            userId: session.userId as string
        }
    });

    revalidatePath('/plans');
}

export async function executePlan(planId: string, data: {
    category: string;
    date: string; // ISO Date
}) {
    const session = await verifySession();
    if (!session) return { error: 'No autorizado' };

    // 1. Obtener el plan original
    const plan = await prisma.expensePlan.findUnique({
        where: { id: planId, userId: session.userId as string }
    });

    if (!plan) return { error: 'Plan no encontrado' };

    // 2. Determinar tipo de gasto
    const type = plan.installments > 1 ? 'INSTALLMENT' : 'SINGLE';

    // 3. Crear el Gasto (Expense)
    await prisma.expense.create({
        data: {
            userId: session.userId as string,
            description: plan.name,
            amount: plan.amount,
            category: data.category,
            date: new Date(data.date), // Fecha elegida por el usuario
            type: type,
            installmentsTotal: plan.installments,
            installmentNumber: 1, // Empieza en la 1
            isShared: false,
            paidBy: 'me'
        }
    });

    // 4. Eliminar el plan (ya se convirtió en gasto)
    await prisma.expensePlan.delete({
        where: { id: planId }
    });

    revalidatePath('/plans');
    revalidatePath('/expenses');
    return { success: true };
}
