// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/dashboard',
  '/products',
  '/templates',
  '/overlay',
  '/live',
  '/analytics',
  '/settings',
  '/billing',
  '/guide',
  '/api/products',
  '/api/templates',
  '/api/overlay',
  '/api/live',
  '/api/analytics',
  '/api/billing',
  '/api/upload',
  '/api/stores',
];

const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('next-auth.session-token')?.value
    || request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Root path: redirect based on auth status
  if (pathname === '/') {
    if (authToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/landing', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.some(path => pathname.startsWith(path)) && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
    '/',
    '/dashboard/:path*',
    '/products/:path*',
    '/templates/:path*',
    '/overlay/:path*',
    '/live/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/billing/:path*',
    '/guide/:path*',
    '/api/products/:path*',
    '/api/templates/:path*',
    '/api/overlay/:path*',
    '/api/live/:path*',
    '/api/analytics/:path*',
    '/api/billing/:path*',
    '/api/upload/:path*',
    '/api/stores/:path*',
    '/login',
    '/register',
  ],
};
