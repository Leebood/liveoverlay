// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/products',
  '/templates',
  '/overlay',
  '/live',
  '/analytics',
  '/settings',
  '/billing',
  '/api/products',
  '/api/templates',
  '/api/overlay',
  '/api/live',
  '/api/analytics',
  '/api/billing',
  '/api/upload',
];

const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token cookie (simplified - in production use NextAuth session)
  const authToken = request.cookies.get('next-auth.session-token')?.value
    || request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Redirect authenticated users away from auth pages
  if (authPaths.some(path => pathname.startsWith(path)) && authToken) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  // Protect dashboard and API routes
  if (protectedPaths.some(path => pathname.startsWith(path)) && !authToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/products/:path*',
    '/templates/:path*',
    '/overlay/:path*',
    '/live/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/billing/:path*',
    '/api/products/:path*',
    '/api/templates/:path*',
    '/api/overlay/:path*',
    '/api/live/:path*',
    '/api/analytics/:path*',
    '/api/billing/:path*',
    '/api/upload/:path*',
    '/login',
    '/register',
  ],
};
