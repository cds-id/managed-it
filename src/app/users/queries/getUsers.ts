import { resolver } from "@blitzjs/rpc"
import db from "db"

export interface User {
  id: string
  name: string | null
  email: string
}

export default resolver.pipe(
  resolver.authorize(),
  async () => {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    })
    return { users } // Return an object with users array
  }
)
