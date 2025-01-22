import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateClientSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const client = await db.client.update({ where: { id }, data })
    return client
  }
)
