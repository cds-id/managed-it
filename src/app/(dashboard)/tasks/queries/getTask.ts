import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { TaskForEdit } from "../types"

const GetTask = z.object({
  id: z.string()
})

export default resolver.pipe(
  resolver.zod(GetTask),
  resolver.authorize(),
  async ({ id }): Promise<TaskForEdit> => {
    const task = await db.task.findFirst({
      where: { id },
      include: {
        client: {
          select: {
            name: true
          }
        },
        assignees: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
    })

    if (!task) throw new NotFoundError()

    return task as TaskForEdit
  }
)
