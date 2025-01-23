import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskSchema } from "../schemas"
import { AuthenticationError, AuthorizationError } from "blitz"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async ({ assigneeIds, ...input }, ctx) => {
    // Check if user is authenticated
    if (!ctx.session.userId) throw new AuthenticationError()

    // Check if user is admin
    if (ctx.session.role !== "ADMIN") {
      throw new AuthorizationError("You must be an admin to create tasks")
    }

    try {
      const task = await db.task.create({
        data: {
          ...input,
          deadline: input.deadline ? new Date(input.deadline) : null,
          assignees: {
            connect: assigneeIds?.map(id => ({ id })) || [],
          },
        },
        include: {
          client: true,
          assignees: true,
        },
      })
      return task
    } catch (error) {
      console.error("Error in createTask mutation:", error)
      throw error
    }
  }
)
