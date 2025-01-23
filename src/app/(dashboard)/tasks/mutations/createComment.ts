import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { Comment } from "@prisma/client"

const CreateComment = z.object({
  taskId: z.string(),
  content: z.string().min(1)
})

export default resolver.pipe(
  resolver.zod(CreateComment),
  resolver.authorize(),
  async ({ taskId, content }, ctx): Promise<Comment> => {
    const comment = await db.comment.create({
      data: {
        content,
        task: { connect: { id: taskId } },
        user: { connect: { id: ctx.session.userId! } }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    return comment
  }
)
