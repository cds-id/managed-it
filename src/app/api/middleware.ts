import { NextResponse } from "next/server"
import { getBlitzContext } from "../blitz-server"
import { validateApiToken } from "@/src/lib/auth"

export async function middleware(request: Request) {
  // Check if request is for files
  if (request.url.includes("/api/reports/") || request.url.includes("/api/uploads/")) {
    // First check for API token
    const authHeader = request.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "")
      const userId = await validateApiToken(token)
      if (userId) {
        return NextResponse.next()
      }
    }

    // If no valid API token, check for session authentication
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
