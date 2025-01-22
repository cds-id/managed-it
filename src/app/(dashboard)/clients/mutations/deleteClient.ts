import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteClientSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteClientSchema),
  resolver.authorize(),
  async ({ id }) => {
    // Start a transaction to ensure all operations succeed or none do
    return await db.$transaction(async (tx) => {
      // First, delete all SprintTasks related to this client's tasks
      await tx.sprintTask.deleteMany({
        where: {
          task: {
            clientId: id
          }
        }
      })

      // Delete all sprints related to this client
      await tx.sprint.deleteMany({
        where: {
          clientId: id
        }
      })

      // Delete all tasks related to this client
      await tx.task.deleteMany({
        where: {
          clientId: id
        }
      })

      // Finally, delete the client
      const client = await tx.client.delete({
        where: { id }
      })

      return client
    })
  }
)
