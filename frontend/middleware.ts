import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    const backendUrl = `http://backend:8000${pathname}${request.nextUrl.search}`;

    return NextResponse.rewrite(new URL(backendUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
