import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public paths that don't require configuration check
const PUBLIC_PATHS = [
  '/setup',
  '/api/setup/check',
  '/_next',
  '/favicon.ico'
]

export function middleware(request: NextRequest) {
  // Skip middleware for public paths
  if (PUBLIC_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    return NextResponse.redirect(new URL('/setup', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/setup (API routes for setup)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/setup|_next/static|_next/image|favicon.ico).*)',
  ],
}
