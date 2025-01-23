import { resolver } from "@blitzjs/rpc"
import db from "db"

export interface DashboardStats {
  totalClients: number
  activeTasks: number
  activeSprints: number
}

export default resolver.pipe(
  resolver.authorize(),
  async () => {
    const [totalClients, activeTasks, activeSprints] = await Promise.all([
      // Get total clients
      db.client.count(),

      // Get active tasks (TODO and IN_PROGRESS)
      db.task.count({
        where: {
          status: {
            in: ['TODO', 'IN_PROGRESS']
          }
        }
      }),

      // Get active sprints (where endDate is null or in the future)
      db.sprint.count({
        where: {
          OR: [
            { endDate: null },
            { endDate: { gt: new Date() } }
          ]
        }
      })
    ])

    return {
      totalClients,
      activeTasks,
      activeSprints
    }
  }
)
