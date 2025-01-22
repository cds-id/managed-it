import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateSprintSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateSprintSchema),
  resolver.authorize(),
  async ({ taskIds, ...data }) => {
    const sprint = await db.sprint.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        sprintTasks: {
          create: taskIds.map((taskId) => ({
            task: { connect: { id: taskId } },
          })),
        },
      },
      include: {
        client: true,
        sprintTasks: {
          include: {
            task: true,
          },
        },
      },
    })

    return sprint
  }
)
