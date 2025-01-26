import { NextRequest, NextResponse } from "next/server"
import { validateApiToken } from "@/src/lib/auth"
import db from "db"
import { TimeEntry } from "@/src/app/(dashboard)/timetracking/types"

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

    const timeEntries = await db.timeEntry.findMany({
      where: {
        userId,
      },
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
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 })
  }
}
