import { NextRequest, NextResponse } from "next/server"
import { validateApiToken } from "@/src/lib/auth"
import db from "db"
import { TimeEntry } from "@/src/app/(dashboard)/timetracking/types"
import { z } from "zod"

// Schema for POST request
const CreateTimeEntrySchema = z.object({
  taskId: z.string(),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  description: z.string().optional(),
})

// Schema for GET request query parameters
const GetTimeEntriesSchema = z.object({
  taskId: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : undefined)),
})

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const userId = await validateApiToken(token)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const params = {
      taskId: url.searchParams.get("taskId") || undefined,
      startDate: url.searchParams.get("startDate") || undefined,
      endDate: url.searchParams.get("endDate") || undefined,
    }

    // Validate query parameters
    const validatedParams = GetTimeEntriesSchema.parse(params)

    // Build where clause
    const where: any = {
      userId,
      ...(validatedParams.taskId && { taskId: validatedParams.taskId }),
      ...(validatedParams.startDate &&
        validatedParams.endDate && {
          startTime: {
            gte: validatedParams.startDate,
            lte: validatedParams.endDate,
          },
        }),
    }

    const timeEntries = await db.timeEntry.findMany({
      where,
      include: {
        task: {
          include: {
            client: true,
          },
        },
        user: true,
      },
      orderBy: {
        startTime: "desc",
      },
    })

    return NextResponse.json({ timeEntries: timeEntries as TimeEntry[] })
  } catch (error) {
    console.error("Error fetching time entries:", error)
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const userId = await validateApiToken(token)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = CreateTimeEntrySchema.parse(body)

    // Calculate duration in minutes
    const duration = Math.round(
      (validatedData.endTime.getTime() - validatedData.startTime.getTime()) / (1000 * 60)
    )

    const timeEntry = await db.timeEntry.create({
      data: {
        taskId: validatedData.taskId,
        userId,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        duration,
        description: validatedData.description,
      },
      include: {
        task: {
          include: {
            client: true,
          },
        },
        user: true,
      },
    })

    return NextResponse.json({ timeEntry })
  } catch (error) {
    console.error("Error creating time entry:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Failed to create time entry" }, { status: 500 })
  }
}
