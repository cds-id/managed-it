import { Task, User, Priority, TaskStatus } from "@prisma/client"

export interface TaskWithRelations extends Task {
  client: {
    name: string
  }
  assignees: {
    id: string
    name: string | null
    email: string
  }[]
  _count?: {
    comments: number
  }
}
