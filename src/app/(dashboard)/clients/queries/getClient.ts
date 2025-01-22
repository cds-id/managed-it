import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetClient = z.object({
  id: z.string()
})

export default resolver.pipe(
  resolver.zod(GetClient),
  resolver.authorize(),
  async ({ id }) => {
    const client = await db.client.findFirst({ where: { id } })
    if (!client) throw new NotFoundError()
    return client
  }
)
