import { Sprint, Task, Client, SprintTask } from "@prisma/client"

export interface SprintWithDetails extends Sprint {
  client: Client
  sprintTasks: (SprintTask & {
    task: Task
  })[]
}

export interface SprintReportData {
  sprintId: string
  reportType: 'BAST' | 'PROGRESS'
  customText?: string
}

export interface GenerateReportResult {
  url: string
  filename: string
}
