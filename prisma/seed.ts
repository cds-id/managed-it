import db from "../db"
import { Password } from "../src/lib/password"

async function seed() {
  console.log("🌱 Starting database seed...")

  try {
    // Create default admin user
    const hashedPassword = await Password.hash("admin123!")
    const admin = await db.user.create({
      data: {
        email: "admin@managed-it.com",
        name: "System Administrator",
        hashedPassword,
        role: "ADMIN",
      },
    })

    console.log("✅ Created default admin user:", admin.email)

    // Create demo client
    const demoClient = await db.client.create({
      data: {
        name: "Demo Company",
        contactInfo: "contact@demo.com",
        notes: "Demo client for testing",
      },
    })
    console.log("✅ Created demo client:", demoClient.name)

    // Create demo task
    const demoTask = await db.task.create({
      data: {
        title: "Welcome Task",
        description: "This is a demo task to help you get started with Managed IT",
        priority: "MEDIUM",
        status: "TODO",
        clientId: demoClient.id,
        assignees: {
          connect: { id: admin.id },
        },
      },
    })
    console.log("✅ Created demo task:", demoTask.title)

    console.log("✅ Seed completed successfully")
  } catch (error) {
    console.error("❌ Error during seed:", error)
    process.exit(1)
  }
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
