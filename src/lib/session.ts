import 'server-only';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function verifySession() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    // Opcional: Asegurar que el usuario existe en nuestra DB local para mantener integridad referencial
    // Esto es útil si tienes relaciones Foreign Key estrictas con la tabla User
    try {
        await prisma.user.upsert({
            where: { id: userId },
            update: {}, // No actualizar nada si ya existe
            create: {
                id: userId,
                // Como Clerk maneja la auth, usamos el ID como username temporal si es un usuario nuevo
                username: `user_${userId}`, // Usamos ID completo para evitar colisiones
                password: 'placeholder', // Placeholder, no se usa
            }
        });
    } catch (error) {
        console.error("Error sincronizando usuario Clerk con Prisma:", error);
        // Continuamos igual, esperando que no explote si la FK es opcional
    }

    return { userId };
}

// Funciones obsoletas mantenidas para evitar romper imports, pero ya no hacen nada
// La gestión de sesión ahora es 100% de Clerk
export async function createSession(userId: string) {
    // No-op
}

export async function deleteSession() {
    // No-op
}
