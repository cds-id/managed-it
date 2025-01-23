import { resolver } from "@blitzjs/rpc"
import { AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { Role } from "types"
import { Password } from "@/src/lib/password"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({ email: rawEmail, password: rawPassword })
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const isValid = await Password.verify(user?.hashedPassword ?? "", password)
  if (!isValid) throw new AuthenticationError()

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  const user = await authenticateUser(email, password)
  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})
