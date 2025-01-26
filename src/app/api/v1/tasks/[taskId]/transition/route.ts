import { NextRequest, NextResponse } from "next/server"
import { validateApiToken } from "@/src/lib/auth"
import db from "db"
import { z } from "zod"
import { TaskStatus } from "@prisma/client"

const TransitionSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  comment: z.string().optional(),
})

export async function POST(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    // Validate token
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const userId = await validateApiToken(token)
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Get task ID from params
    const { taskId } = params

    // Validate request body
    const body = await request.json()
    const { status, comment } = TransitionSchema.parse(body)

    // Check if user has access to this task
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        assignees: {
          some: { id: userId },
        },
      },
      include: {
        assignees: true,
        client: true,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found or access denied" }, { status: 404 })
    }

    // Start a transaction for status update and comment creation
    const result = await db.$transaction(async (tx) => {
      // Update task status
      const updatedTask = await tx.task.update({
        where: { id: taskId },
        data: { status },
        include: {
          assignees: true,
          client: true,
        },
      })

      // Create comment if provided
      if (comment) {
        await tx.comment.create({
          data: {
            content: `Status changed to ${status}${comment ? `: ${comment}` : ""}`,
            taskId,
            userId,
          },
        })
      }

      return updatedTask
    })

    return NextResponse.json({
      success: true,
      task: result,
    })
  } catch (error) {
    console.error("Error updating task status:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Failed to update task status" }, { status: 500 })
  }
}
