import { Task, User } from "@prisma/client"

export interface TimeEntry {
  id: string
  taskId: string
  userId: string
  startTime: Date
  endTime: Date | null
  duration: number
  description: string | null
  task: Task
  user: User
  createdAt: Date
  updatedAt: Date
}
