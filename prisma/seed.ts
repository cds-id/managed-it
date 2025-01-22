import db from "../db"
import { SecurePassword } from "@blitzjs/auth/secure-password"

async function seed() {
  console.log("Seeding database...")

  // Create admin user
  const hashedPassword = await SecurePassword.hash("adminPassword123!")
  const admin = await db.user.create({
    data: {
      email: "admin@example.com",
      hashedPassword,
      role: "ADMIN",
      name: "System Admin"
    },
  })

  // Create worker users
  const worker1 = await db.user.create({
    data: {
      email: "worker1@example.com",
      hashedPassword: await SecurePassword.hash("workerPass123!"),
      role: "WORKER",
      name: "John Worker"
    },
  })

  const worker2 = await db.user.create({
    data: {
      email: "worker2@example.com",
      hashedPassword: await SecurePassword.hash("workerPass123!"),
      role: "WORKER",
      name: "Jane Worker"
    },
  })

  // Create sample clients
  const client1 = await db.client.create({
    data: {
      name: "Acme Corporation",
      contactInfo: "contact@acme.com",
      notes: "Major client for IT services"
    },
  })

  const client2 = await db.client.create({
    data: {
      name: "TechStart Inc",
      contactInfo: "info@techstart.com",
      notes: "Startup client needing web development"
    },
  })

  // Create tasks
  const task1 = await db.task.create({
    data: {
      title: "Setup Network Infrastructure",
      description: "Install and configure network equipment",
      priority: "HIGH",
      status: "TODO",
      deadline: new Date(2024, 2, 1),
      clientId: client1.id,
      assignees: {
        connect: [{ id: worker1.id }]
      }
    },
  })

  const task2 = await db.task.create({
    data: {
      title: "Develop Website",
      description: "Create responsive website",
      priority: "MEDIUM",
      status: "IN_PROGRESS",
      deadline: new Date(2024, 3, 1),
      clientId: client2.id,
      assignees: {
        connect: [{ id: worker1.id }, { id: worker2.id }]
      }
    },
  })

  // Create sprints
  const sprint1 = await db.sprint.create({
    data: {
      name: "Network Setup Sprint",
      clientId: client1.id,
      startDate: new Date(),
      endDate: new Date(2024, 2, 1),
      sprintTasks: {
        create: [
          {
            task: {
              connect: { id: task1.id }
            }
          }
        ]
      }
    },
  })

  console.log("Database seeding finished")
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
