import { NextResponse } from 'next/server';
import { auth } from './firebase';

export async function middleware(request) {
  const url = request.nextUrl.clone();

  // Skip middleware for API routes and static files
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // Allow login page
  if (url.pathname === '/login') {
    return NextResponse.next();
  }

  // Check auth state
  const session = auth.currentUser;
  if (!session) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
