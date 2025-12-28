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

export async function register(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!username || !password || !confirmPassword) {
        return { error: 'Complete todos los campos' };
    }

    if (password !== confirmPassword) {
        return { error: 'Las contraseñas no coinciden' };
    }

    if (password.length < 4) {
        return { error: 'La contraseña debe tener al menos 4 caracteres' };
    }

    try {
        // Check if user exists
        let existingUser;
        // Raw query fallback common in this env
        const existingUsers = await prisma.$queryRaw`SELECT * FROM User WHERE username = ${username} LIMIT 1` as any[];
        existingUser = existingUsers[0];

        if (existingUser) {
            return { error: 'El nombre de usuario ya existe' };
        }

        // Create User
        let newUser: any;
        if ((prisma as any).user) {
            newUser = await prisma.user.create({
                data: {
                    username,
                    password,
                }
            });
        } else {
            // Fallback ID generation
            const crypto = require('crypto');
            const newId = 'user_' + crypto.randomBytes(8).toString('hex');
            const now = new Date().toISOString();

            await prisma.$executeRaw`INSERT INTO User (id, username, password, createdAt, updatedAt) VALUES (${newId}, ${username}, ${password}, ${now}, ${now})`;
            newUser = { id: newId };
        }

        await createSession(newUser.id);

    } catch (e) {
        console.error('Register error', e);
        return { error: 'Error al registrar usuario' };
    }

    redirect('/');
}
