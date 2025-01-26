import { NextRequest, NextResponse } from "next/server"
import { validateApiToken } from "@/src/lib/auth"
import db from "db"
import { z } from "zod"

// Schema for query parameters
const GetTasksQuerySchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  clientId: z.string().optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).optional(),
  perPage: z.string().transform(Number).optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Validate API token
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const userId = await validateApiToken(token)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get user to check assignments
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    // Parse query parameters
    const url = new URL(request.url)
    const params = {
      status: url.searchParams.get("status") || undefined,
      priority: url.searchParams.get("priority") || undefined,
      clientId: url.searchParams.get("clientId") || undefined,
      search: url.searchParams.get("search") || undefined,
      page: url.searchParams.get("page") || "1",
      perPage: url.searchParams.get("perPage") || "10",
    }

    const validatedParams = GetTasksQuerySchema.parse(params)

    // Build where clause
    const where: any = {
      AND: [
        // If user is not admin, only show assigned tasks
        user?.role !== "ADMIN"
          ? {
              assignees: {
                some: { id: userId },
              },
            }
          : {},
        // Status filter
        validatedParams.status ? { status: validatedParams.status } : {},
        // Priority filter
        validatedParams.priority ? { priority: validatedParams.priority } : {},
        // Client filter
        validatedParams.clientId ? { clientId: validatedParams.clientId } : {},
        // Search in title and description
        validatedParams.search
          ? {
              OR: [
                { title: { contains: validatedParams.search } },
                { description: { contains: validatedParams.search } },
              ],
            }
          : {},
      ],
    }

    // Calculate pagination
    const page = validatedParams.page || 1
    const perPage = validatedParams.perPage || 10
    const skip = (page - 1) * perPage

    // Get total count for pagination
    const totalCount = await db.task.count({ where })

    // Get tasks
    const tasks = await db.task.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        assignees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        timeEntries: {
          where: {
            userId,
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            duration: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: perPage,
    })

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        hasMore: page * perPage < totalCount,
      },
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
