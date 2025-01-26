import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the origin from the request headers
  const origin = request.headers.get("origin")

  // Get the request method
  const method = request.method

  // Handle preflight requests
  if (method === "OPTIONS") {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // 24 hours
    }

    return new NextResponse(null, {
      status: 204,
      headers,
    })
  }

  // Create the response
  const response = NextResponse.next()

  // Add CORS headers to all responses
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return response
}

// Configure which routes this middleware applies to
export const config = {
  matcher: "/api/v1/:path*",
}
