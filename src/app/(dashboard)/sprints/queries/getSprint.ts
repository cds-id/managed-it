import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetSprint = z.object({
  id: z.string()
})

export default resolver.pipe(
  resolver.zod(GetSprint),
  resolver.authorize(),
  async ({ id }) => {
    const sprint = await db.sprint.findFirst({
      where: { id },
      include: {
        client: {
          select: {
            name: true,
          },
        },
        sprintTasks: {
          include: {
            task: true,
          },
        },
      },
    })

    if (!sprint) throw new NotFoundError()

    return sprint
  }
)
