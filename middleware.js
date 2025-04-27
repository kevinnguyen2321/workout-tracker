import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/personalBest', '/workoutSessions', '/exercises'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow Next.js internals, static files, and API/auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('Token:', token); // Add this line to debug

  if (!token) {
    const loginUrl = new URL('/auth/login', req.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|auth|favicon.ico).*)'],
};
