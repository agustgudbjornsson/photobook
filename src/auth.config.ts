import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const protectedRoutes = ['/dashboard', '/editor', '/order', '/admin'];
            const isProtectedRoute = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));

            const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');

            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }

            if (isLoggedIn && isAuthRoute) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
