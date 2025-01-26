import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { stat, readFile } from "fs/promises"
import { getBlitzContext } from "@/src/app/blitz-server"
import { validateApiToken } from "@/src/lib/auth"

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"]

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    // Check authentication - either session or API token
    let isAuthenticated = false

    // First check for API token
    const authHeader = request.headers.get("Authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "")
      const userId = await validateApiToken(token)
      if (userId) {
        isAuthenticated = true
      }
    }

    // If no valid API token, check for session authentication
    if (!isAuthenticated) {
      const ctx = await getBlitzContext()
      if (ctx.session.userId) {
        isAuthenticated = true
      }
    }

    // Return unauthorized if neither authentication method is valid
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const filename = params.filename
    const filePath = join(process.cwd(), "public", "uploads", filename)

    // Validate file extension
    const extension = filename.split(".").pop()?.toLowerCase()
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      return new NextResponse("Invalid file type", { status: 400 })
    }

    try {
      // Check if file exists
      await stat(filePath)
    } catch (error) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Read file
    const fileBuffer = await readFile(filePath)

    // Map file extensions to content types
    const contentTypes: { [key: string]: string } = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    }

    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    })

    return response
  } catch (error) {
    console.error("Error serving upload:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
