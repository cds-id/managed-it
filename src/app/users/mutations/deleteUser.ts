import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const DeleteUser = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteUser),
  resolver.authorize("ADMIN"),
  async ({ id }) => {
    // Prevent deleting the last admin
    const adminCount = await db.user.count({
      where: { role: "ADMIN" }
    })

    const userToDelete = await db.user.findUnique({
      where: { id },
      select: { role: true }
    })

    if (adminCount === 1 && userToDelete?.role === "ADMIN") {
      throw new Error("Cannot delete the last admin user")
    }

    const user = await db.user.delete({
      where: { id },
    })

    return user
  }
)
