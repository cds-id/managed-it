import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { nanoid } from "nanoid"

const CreateApiToken = z.object({
  name: z.string().min(1),
  type: z.enum(["PERSONAL", "INTEGRATION"]),
})

export default resolver.pipe(
  resolver.zod(CreateApiToken),
  resolver.authorize(),
  async ({ name, type }, ctx) => {
    const token = nanoid(32)

    const apiToken = await db.apiToken.create({
      data: {
        name,
        type,
        token,
        userId: ctx.session.userId!,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    })

    // Return the plain token - this is the only time it will be visible
    return { ...apiToken, token }
  }
)
