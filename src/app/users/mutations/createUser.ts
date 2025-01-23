import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateUserSchema } from "../schemas"
import { SecurePassword } from "@blitzjs/auth/secure-password"

export default resolver.pipe(
  resolver.zod(CreateUserSchema),
  resolver.authorize("ADMIN"),
  async ({ password, ...data }) => {
    const hashedPassword = await SecurePassword.hash(password)
    const user = await db.user.create({
      data: { ...data, hashedPassword },
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
