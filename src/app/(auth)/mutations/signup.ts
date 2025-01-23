import db from "db"
import { Password } from "src/lib/password"

export default async function signup(input: { password: string; email: string }, ctx: any) {
  const blitzContext = ctx
  const hashedPassword = await Password.hash(input.password || "test-password")
  const email = input.email || "test" + Math.random() + "@test.com"

  const user = await db.user.create({
    data: { email, hashedPassword },
  })

  await blitzContext.session.$create({
    userId: user.id,
    role: "user",
  })

  return { userId: blitzContext.session.userId, ...user, email: input.email }
}
