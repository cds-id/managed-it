import { NextResponse } from 'next/server'
import { getBlitzContext } from 'src/app/blitz-server'

export async function middleware(request: Request) {
  const ctx = await getBlitzContext()

  if (!ctx.session.userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: '/api/upload',
}
