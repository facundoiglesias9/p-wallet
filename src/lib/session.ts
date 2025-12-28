import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = 'secret-key-facundo-app';
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await new SignJWT({ userId, expiresAt })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);

    (await cookies()).set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    (await cookies()).delete('session');
}

export async function verifySession() {
    const cookie = (await cookies()).get('session')?.value;
    if (!cookie) return null;

    try {
        const { payload } = await jwtVerify(cookie, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (e) {
        // console.error('Failed to verify session');
        return null;
    }
}
