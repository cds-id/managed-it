import { Task, Client } from "@prisma/client"

export interface TaskWithClient extends Task {
  client: Client
}

export interface TaskSummary {
  dueToday: TaskWithClient[]
  overdue: TaskWithClient[]
  inProgress: TaskWithClient[]
  completedToday: TaskWithClient[]
  upcomingDeadlines: TaskWithClient[]
}
