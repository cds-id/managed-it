import { NextResponse } from "next/server"
import { getBlitzContext } from "../blitz-server"

export async function middleware(request: Request) {
  // Check if request is for files
  if (request.url.includes("/api/reports/") || request.url.includes("/api/uploads/")) {
    const ctx = await getBlitzContext()

    if (!ctx.session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/reports/:path*", "/api/uploads/:path*"],
}
