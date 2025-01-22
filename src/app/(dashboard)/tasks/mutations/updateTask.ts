import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateTaskSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateTaskSchema),
  resolver.authorize(),
  async ({ id, assigneeIds, ...data }) => {
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
