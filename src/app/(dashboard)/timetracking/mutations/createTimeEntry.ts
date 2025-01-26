import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { TimeEntry } from "../types"

const CreateTimeEntry = z.object({
  taskId: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number(),
  description: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateTimeEntry),
  resolver.authorize(),
  async ({ taskId, startTime, endTime, duration, description }, ctx): Promise<TimeEntry> => {
    const timeEntry = await db.timeEntry.create({
      data: {
        task: { connect: { id: taskId } },
        user: { connect: { id: ctx.session.userId! } },
        startTime,
        endTime,
        duration,
        description,
      },
      include: {
        task: true,
        user: true,
      },
    })

    return timeEntry as TimeEntry
  }
)
