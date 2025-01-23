import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow setup routes without authentication
  if (request.nextUrl.pathname.startsWith('/api/setup')) {
    return NextResponse.next({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Handle other API routes...
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
