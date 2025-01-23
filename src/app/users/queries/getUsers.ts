import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UserRole } from "@prisma/client"

export interface User {
  id: string
  name: string | null
  email: string
  role: UserRole
  createdAt: Date
}

export default resolver.pipe(
  resolver.authorize("ADMIN"),
  async () => {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return { users }
  }
)
