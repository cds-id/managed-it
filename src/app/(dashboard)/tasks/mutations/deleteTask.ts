import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTaskSchema } from "../schemas"
import { AuthenticationError, AuthorizationError } from "blitz"

export default resolver.pipe(
  resolver.zod(DeleteTaskSchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // Check if user is authenticated
    if (!ctx.session.userId) throw new AuthenticationError()

    // Check if user is admin
    if (ctx.session.role !== "ADMIN") {
      throw new AuthorizationError("You must be an admin to delete tasks")
    }

    return await db.$transaction(async (tx) => {
      // Delete sprint tasks first
      await tx.sprintTask.deleteMany({
        where: { taskId: id }
      })

      // Then delete the task
      const task = await tx.task.delete({
        where: { id }
      })

      return task
    })
  }
)
