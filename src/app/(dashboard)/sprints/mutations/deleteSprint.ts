import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteSprint = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteSprint),
  resolver.authorize(),
  async ({ id }) => {
    return await db.$transaction(async (tx) => {
      // Delete sprint tasks first
      await tx.sprintTask.deleteMany({
        where: { sprintId: id },
      })

      // Then delete the sprint
      const sprint = await tx.sprint.delete({
        where: { id },
      })

      return sprint
    })
  }
)
