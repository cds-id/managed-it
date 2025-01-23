import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { stat, readFile } from "fs/promises"
import { getBlitzContext } from "@/src/app/blitz-server"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    // Check authentication
    const ctx = await getBlitzContext()
    if (!ctx.session.userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const filename = params.filename
    const filePath = join(process.cwd(), "public", "reports", filename)

    try {
      // Check if file exists
      await stat(filePath)
    } catch (error) {
      return new NextResponse("File not found", { status: 404 })
    }

    // Read file
    const fileBuffer = await readFile(filePath)

    // Determine content type
    const contentType = filename.endsWith(".pdf") ? "application/pdf" : "application/octet-stream"

    // Create response with appropriate headers
    const response = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    })

    return response
  } catch (error) {
    console.error("Error serving report:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
