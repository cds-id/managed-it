import db from "../db"
import { SecurePassword } from "@blitzjs/auth/secure-password"

async function seed() {
  // Create default admin user
  const hashedPassword = await SecurePassword.hash("Password123!")

  await db.user.create({
    data: {
      email: "admin@example.com",
      hashedPassword,
      role: "ADMIN",
      name: "System Admin"
    }
  })

  console.log("🌱 Database seeded successfully")
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
