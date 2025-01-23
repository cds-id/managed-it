import { resolver } from "@blitzjs/rpc"
import db from "db"

export interface RecentActivity {
  id: string
  type: 'TASK_CREATED' | 'TASK_UPDATED' | 'SPRINT_CREATED' | 'CLIENT_CREATED'
  timestamp: Date
  description: string
  entityId: string
  entityType: 'task' | 'sprint' | 'client'
  clientName?: string
  taskTitle?: string
  sprintName?: string
}

export default resolver.pipe(
  resolver.authorize(),
  async () => {
    // Get recent tasks
    const recentTasks = await db.task.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true
      }
    })

    // Get recent sprints
    const recentSprints = await db.sprint.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true
      }
    })

    // Get recent clients
    const recentClients = await db.client.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    // Combine and sort activities
    const activities: RecentActivity[] = [
      ...recentTasks.map(task => ({
        id: `task-${task.id}`,
        type: 'TASK_CREATED' as const,
        timestamp: task.createdAt,
        description: `New task created: ${task.title}`,
        entityId: task.id,
        entityType: 'task' as const,
        clientName: task.client.name,
        taskTitle: task.title
      })),
      ...recentSprints.map(sprint => ({
        id: `sprint-${sprint.id}`,
        type: 'SPRINT_CREATED' as const,
        timestamp: sprint.createdAt,
        description: `New sprint created: ${sprint.name}`,
        entityId: sprint.id,
        entityType: 'sprint' as const,
        clientName: sprint.client.name,
        sprintName: sprint.name
      })),
      ...recentClients.map(client => ({
        id: `client-${client.id}`,
        type: 'CLIENT_CREATED' as const,
        timestamp: client.createdAt,
        description: `New client added: ${client.name}`,
        entityId: client.id,
        entityType: 'client' as const,
        clientName: client.name
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10)

    return activities
  }
)
