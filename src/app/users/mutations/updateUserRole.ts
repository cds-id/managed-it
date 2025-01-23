import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import { UserRole } from "@prisma/client"

const UpdateUserRole = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "WORKER"])
})

export default resolver.pipe(
  resolver.zod(UpdateUserRole),
  resolver.authorize("ADMIN"),
  async ({ userId, role }) => {
    const user = await db.user.update({
      where: { id: userId },
      data: { role },
    })
    return user
  }
)
