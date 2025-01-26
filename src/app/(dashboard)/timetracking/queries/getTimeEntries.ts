import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { TimeEntry } from "../types"

const GetTimeEntries = z.object({
  taskId: z.string().optional(),
})

interface GetTimeEntriesResult {
  timeEntries: TimeEntry[]
}

export default resolver.pipe(
  resolver.zod(GetTimeEntries),
  resolver.authorize(),
  async ({ taskId }, ctx): Promise<GetTimeEntriesResult> => {
    const timeEntries = await db.timeEntry.findMany({
      where: {
        userId: ctx.session.userId,
        ...(taskId ? { taskId } : {}),
      },
      include: {
        task: true,
        user: true,
      },
      orderBy: {
        startTime: "desc",
      },
    })

    return { timeEntries: timeEntries as TimeEntry[] }
  }
)
