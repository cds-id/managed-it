import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskSchema } from "../schemas"
import { AuthenticationError, AuthorizationError } from "blitz"

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, assigneeIds, ...data }, ctx) => {
    // Check if user is authenticated
    if (!ctx.session.userId) throw new AuthenticationError()

    // Check if user is admin
    if (ctx.session.role !== "ADMIN") {
      throw new AuthorizationError("You must be an admin to update tasks")
    }

    const task = await db.task.update({
      where: { id },
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : null,
        assignees: {
          set: assigneeIds?.map(id => ({ id })) || [],
        },
      },
    })
    return task
  }
)
