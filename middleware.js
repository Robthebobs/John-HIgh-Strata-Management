import { NextResponse } from 'next/server';

export const config = {
  matcher: '/api/:path*',
};

export default function middleware(request) {
  if (request.nextUrl.pathname === '/api/404') {
    return new NextResponse(
      JSON.stringify({
        status: 404,
        message: 'Page not found!!!',
      }),
      {
        status: 404,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  if (request.nextUrl.pathname === '/api/auth') {
    if (request.method !== 'POST') {
      return new NextResponse(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }
  }
  
  return NextResponse.next();
} 