import { z } from "zod"

const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  clientId: z.string().min(1, "Client is required"),
  deadline: z.string().optional().nullable(),
  assigneeIds: z.array(z.string()).default([]),
})

export const CreateTaskSchema = TaskSchema

export const UpdateTaskSchema = TaskSchema.extend({
  id: z.string(),
})

export const DeleteTaskSchema = z.object({
  id: z.string(),
})
