import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetSprintsInput {
  search?: string
  clientId?: string
  page: number
  perPage: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ search, clientId, page = 0, perPage = 10 }: GetSprintsInput) => {
    const where: Prisma.SprintWhereInput = {
      AND: [
        // Search by name
        search ? { name: { contains: search } } : {},
        // Filter by client
        clientId ? { clientId } : {},
      ].filter(Boolean),
    }

    const {
      items: sprints,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip: page * perPage,
      take: perPage,
      count: () => db.sprint.count({ where }),
      query: (paginateArgs) =>
        db.sprint.findMany({
          ...paginateArgs,
          where,
          orderBy: { startDate: "desc" },
          include: {
            client: {
              select: {
                name: true,
              },
            },
            sprintTasks: {
              include: {
                task: {
                  select: {
                    status: true,
                  },
                },
              },
            },
          },
        }),
    })

    return {
      sprints,
      nextPage,
      hasMore,
      count,
      totalPages: Math.ceil(count / perPage),
    }
  }
)
