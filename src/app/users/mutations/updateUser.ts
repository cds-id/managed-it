import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateUserSchema } from "../schemas"
import { Password } from "src/lib/password"

export default resolver.pipe(
  resolver.zod(UpdateUserSchema),
  resolver.authorize("ADMIN"),
  async ({ id, password, ...data }) => {
    const updateData: any = { ...data }

    if (password) {
      updateData.hashedPassword = await Password.hash(password)
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })
    return user
  }
)
