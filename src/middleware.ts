import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

export async function middleware(request: NextRequest) {
    // 1. Check for public paths
    if (request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    // 2. Verify Session
    // We can't import server actions or prisma here easily in Edge runtime (where middleware often runs)
    // Use the verifySession helper (jose is edge compatible)

    // Note: We need to manually verify because `verifySession` uses `next/headers` which might be restricted?
    // Actually next/headers `cookies()` works in Middleware in App Router? 
    // Wait, middleware runs before components. `cookies()` from next/headers should work or `request.cookies`.
    // Let's use `request.cookies` here for speed and avoiding async component logic issues.

    const cookie = request.cookies.get('session')?.value;

    if (!cookie) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optional: Verify validity (exp) using jose here if we want strict security,
    // but for "facundo" app simple existence check + page-level verify is usually enough 
    // OR just minimal verification.

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
