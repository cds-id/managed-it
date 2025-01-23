import { Task, User, Priority, TaskStatus } from "@prisma/client"

// Define the minimal user type needed for task assignments
export interface TaskAssignee {
  id: string
  name: string | null
  email: string
}

export interface TaskWithRelations extends Task {
  client: {
    name: string
  }
  assignees: TaskAssignee[]
  _count?: {
    comments: number
  }
}

// Define the full task type expected by EditTaskForm
export interface TaskForEdit extends Task {
  client: {
    name: string
  }
  assignees: TaskAssignee[]
}
