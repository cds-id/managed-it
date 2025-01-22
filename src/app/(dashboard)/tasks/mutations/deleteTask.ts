import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteTaskSchema),
  resolver.authorize(),
  async ({ id }) => {
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
