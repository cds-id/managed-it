import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { User } from "./getUsers"

const GetUser = z.object({
  id: z.string()
})

export default resolver.pipe(
  resolver.zod(GetUser),
  resolver.authorize("ADMIN"),
  async ({ id }): Promise<User> => {
    const user = await db.user.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) throw new NotFoundError()

    return user
  }
)
