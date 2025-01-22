import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma, Priority, TaskStatus } from "db"

interface GetTasksInput {
  search?: string
  status?: TaskStatus | null
  priority?: Priority | null
  clientId?: string | null
  page: number
  perPage: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ search, status, priority, clientId, page = 0, perPage = 10 }: GetTasksInput) => {
    const where: Prisma.TaskWhereInput = {
      AND: [
        // Search in title and description
        search
          ? {
              OR: [
                { title: { contains: search } },
                { description: { contains: search } },
              ],
            }
          : {},
        // Filter by status
        status ? { status: status as TaskStatus } : {},
        // Filter by priority
        priority ? { priority: priority as Priority } : {},
        // Filter by client
        clientId ? { clientId: clientId } : {},
      ].filter(Boolean), // Remove empty objects
    }

    const {
      items: tasks,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip: page * perPage,
      take: perPage,
      count: () => db.task.count({ where }),
      query: (paginateArgs) =>
        db.task.findMany({
          ...paginateArgs,
          where,
          orderBy: { createdAt: "desc" },
          include: {
            client: {
              select: {
                name: true,
              },
            },
            assignees: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
    })

    return {
      tasks,
      nextPage,
      hasMore,
      count,
      totalPages: Math.ceil(count / perPage),
    }
  }
)
