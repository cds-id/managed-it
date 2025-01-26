import db from "db"

export async function validateApiToken(token: string): Promise<string | null> {
  const apiToken = await db.apiToken.findFirst({
    where: {
      token,
      expiresAt: {
        gt: new Date(),
      },
    },
  })

  if (!apiToken) {
    return null
  }

  await db.apiToken.update({
    where: { id: apiToken.id },
    data: { lastUsedAt: new Date() },
  })

  return apiToken.userId
}
