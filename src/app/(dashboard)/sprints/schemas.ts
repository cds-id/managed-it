import { z } from "zod"

export const CreateSprintSchema = z.object({
  name: z.string().min(1, "Name is required"),
  clientId: z.string().min(1, "Client is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  taskIds: z.array(z.string()).min(1, "At least one task must be selected"),
})

export const UpdateSprintSchema = CreateSprintSchema.extend({
  id: z.string(),
})
