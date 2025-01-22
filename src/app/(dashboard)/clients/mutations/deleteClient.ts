import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteClientSchema),
  resolver.authorize(),
  async ({ id }) => {
    const client = await db.client.delete({ where: { id } })
    return client
  }
)
