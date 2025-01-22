import { z } from "zod";

export const CreateClientSchema = z.object({
  name: z.string(),
  contactInfo: z.string(),
  note: z.string(),
  // template: __fieldName__: z.__zodType__(),
});
export const UpdateClientSchema = CreateClientSchema.merge(
  z.object({
    id: z.number(),
  })
);

export const DeleteClientSchema = z.object({
  id: z.number(),
});
