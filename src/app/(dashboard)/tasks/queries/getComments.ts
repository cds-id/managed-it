import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { Comment } from "@prisma/client"

const GetComments = z.object({
  taskId: z.string()
})

interface CommentWithUser extends Comment {
  user: {
    id: string
    name: string | null
    email: string
  }
}

export default resolver.pipe(
  resolver.zod(GetComments),
  resolver.authorize(),
  async ({ taskId }): Promise<{ comments: CommentWithUser[] }> => {
    const comments = await db.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { comments }
  }
)
