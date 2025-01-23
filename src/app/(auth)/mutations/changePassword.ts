import { NotFoundError } from "blitz"
import db from "db"
import { Password } from "src/lib/password"
import { ChangePassword } from "../validations"
import { resolver } from "@blitzjs/rpc"

export default resolver.pipe(
  resolver.zod(ChangePassword),
  resolver.authorize(),
  async ({ currentPassword, newPassword }, ctx) => {
    const user = await db.user.findFirst({ where: { id: ctx.session.userId } })
    if (!user) throw new NotFoundError()

    const isValid = await Password.verify(user?.hashedPassword ?? "", currentPassword)
    if (!isValid) throw new Error("Current password is incorrect")

    const hashedPassword = await Password.hash(newPassword.trim())
    await db.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    })

    return true
  }
)
