import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateTaskSchema),
  resolver.authorize(),
  async ({ assigneeIds, ...input }) => {
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
