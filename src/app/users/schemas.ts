import { z } from "zod"

export const CreateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "WORKER"])
})

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  role: z.enum(["ADMIN", "WORKER"])
})
