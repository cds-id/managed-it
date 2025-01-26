import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const tokens = await db.apiToken.findMany({
    where: {
      userId: ctx.session.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return { tokens }
})
