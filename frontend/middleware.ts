import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Check for a token in cookies
  const { pathname } = request.nextUrl;

  // Define public paths that don\'t require authentication
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reels', '/map'];
  const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith('/merchant/');

  // Define auth paths where authenticated users should be redirected from
  const authPaths = ['/login', '/register', '/forgot-password'];
  const isAuthPath = authPaths.includes(pathname);

  if (token) {
    // If user is authenticated and tries to access an auth path, redirect to home
    if (isAuthPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, allow access to the requested page
    return NextResponse.next();
  } else {
    // If user is not authenticated and tries to access a protected path, redirect to login
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Otherwise, allow access to public paths
    return NextResponse.next();
  }
}

// Configure middleware to run on all paths except API routes, static files, and _next/static
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)',
  ],
};
