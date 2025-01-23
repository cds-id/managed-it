import { NextResponse } from 'next/server'
import { getBlitzContext } from 'src/app/blitz-server'
import { UserRole } from "@prisma/client"

export async function middleware(request: Request) {
  const ctx = await getBlitzContext()

  // Allow read access to all authenticated users
  if (request.method === "GET") {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!ctx.session.userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Only allow ADMIN users to create/update/delete tasks
  if (ctx.session.role !== UserRole.ADMIN) {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/tasks/:path*', // Apply to all task-related API routes
  ],
}
