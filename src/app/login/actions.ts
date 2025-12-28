'use server';

import prisma from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return { error: 'Complete todos los campos' };
    }

    try {
        let user;
        if ((prisma as any).user) {
            user = await prisma.user.findUnique({
                where: { username }
            });
        } else {
            const users = await prisma.$queryRaw`SELECT * FROM User WHERE username = ${username} LIMIT 1` as any[];
            user = users[0];
        }

        if (!user) {
            return { error: 'Usuario no encontrado' };
        }

        // Simple Plain text comparison as requested ("password facundo")
        if (user.password !== password) {
            // Note: In a real app, use bcrypt.compare
            return { error: 'Contraseña incorrecta' };
        }

        await createSession(user.id);

    } catch (e) {
        console.error('Login error', e);
        return { error: 'Error al iniciar sesión' };
    }

    redirect('/');
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
