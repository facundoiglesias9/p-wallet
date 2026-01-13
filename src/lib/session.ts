import 'server-only';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function verifySession() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    // Ya no hacemos upsert en cada petición para ganar velocidad.
    // El usuario se sincroniza por otros medios o se asume que existe.
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
