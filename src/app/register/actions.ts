'use server';

import prisma from '@/lib/prisma';
import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';

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
        // Note: Using raw query for insert to be safe with prisma client issues in this env
        // Generate a random ID (or let DB handle it if configured, but CUID is prisma default)
        // We'll use uuid logic for simplicity in raw SQL or rely on Prisma if we can.
        // Let's try Prisma create first, fallback to Raw if it fails (but catch block handles it)

        let newUser: any;
        if ((prisma as any).user) {
            newUser = await prisma.user.create({
                data: {
                    username,
                    password, // In real app: bcrypt.hash(password)
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
