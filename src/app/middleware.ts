import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkConfig } from '../lib/config'

export async function middleware(request: NextRequest) {
  // Skip checking for setup and api routes
  if (
    request.nextUrl.pathname.startsWith('/setup') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  try {
    // Check if system is configured
    const isConfigured = await checkConfig()

    if (!isConfigured) {
      // Redirect to setup if not configured
      return NextResponse.redirect(new URL('/setup', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Configuration check failed:', error)
    return NextResponse.redirect(new URL('/setup', request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
