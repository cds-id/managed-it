import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteApiToken = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteApiToken),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const token = await db.apiToken.deleteMany({
      where: {
        id,
        userId: ctx.session.userId,
      },
    })

    return token
  }
)
