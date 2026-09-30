import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  
  // NOTE: In a real app we'd verify the token or cookie
  // For this mock with localStorage we just let client side handle most redirects
  // Or if we use cookies, check here:
  // const token = request.cookies.get('auth-storage');
  
  // return NextResponse.next();
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
