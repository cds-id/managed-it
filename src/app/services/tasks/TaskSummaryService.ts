import db from "db"
import { subDays, startOfDay, endOfDay, addDays } from "date-fns"
import { TaskSummary } from "../email/types"

export class TaskSummaryService {
  async getDailySummary(): Promise<TaskSummary> {
    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)
    const weekFromNow = addDays(today, 7)

    const [dueToday, overdue, inProgress, completedToday, upcomingDeadlines] = await Promise.all([
      // Tasks due today
      db.task.findMany({
        where: {
          deadline: {
            gte: todayStart,
            lte: todayEnd,
          },
          status: {
            not: "DONE",
          },
        },
        include: {
          client: true,
        },
      }),

      // Overdue tasks
      db.task.findMany({
        where: {
          deadline: {
            lt: todayStart,
          },
          status: {
            not: "DONE",
          },
        },
        include: {
          client: true,
        },
      }),

      // Tasks in progress
      db.task.findMany({
        where: {
          status: "IN_PROGRESS",
        },
        include: {
          client: true,
        },
      }),

      // Tasks completed today
      db.task.findMany({
        where: {
          status: "DONE",
          updatedAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        include: {
          client: true,
        },
      }),

      // Upcoming deadlines (next 7 days)
      db.task.findMany({
        where: {
          deadline: {
            gt: todayEnd,
            lte: weekFromNow,
          },
          status: {
            not: "DONE",
          },
        },
        include: {
          client: true,
        },
      }),
    ])

    return {
      dueToday,
      overdue,
      inProgress,
      completedToday,
      upcomingDeadlines,
    }
  }
}
