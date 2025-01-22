import { z } from "zod"

export const ClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactInfo: z.string().min(1, "Contact information is required"),
  notes: z.string().optional(),
})

export const CreateClientSchema = ClientSchema

export const UpdateClientSchema = ClientSchema.extend({
  id: z.string(),
})

export const DeleteClientSchema = z.object({
  id: z.string(),
})
