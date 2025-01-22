import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateClientSchema),
  resolver.authorize(),
  async (input) => {
    const client = await db.client.create({ data: input })
    return client
  }
)
