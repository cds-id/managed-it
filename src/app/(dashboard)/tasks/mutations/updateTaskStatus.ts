import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const UpdateTaskStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
})

export default resolver.pipe(
  resolver.zod(UpdateTaskStatusSchema),
  resolver.authorize(),
  async ({ id, status }) => {
    const task = await db.task.update({
      where: { id },
      data: { status },
    })
    return task
  }
)
