import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;
  // Define public routes (routes that don't require authentication)
  const publicRoutes = [
    '/signin',
    '/auth/login',
    '/signup',
    '/auth/callback',
    '/reset-password',
    '/writing-test-instructions',
    '/take-writing-tests/academic',
    '/take-writing-tests/general-training',
    '/payment/callback',
    '/', // home page should be public
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'; // exact match only for home
    }
    return pathname.startsWith(route);
  });

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicRoute) {
    const signInUrl = new URL('/signin', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated and trying to access signin/signup
  if (
    token &&
    (pathname.startsWith('/signin') || pathname.startsWith('/signup'))
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
