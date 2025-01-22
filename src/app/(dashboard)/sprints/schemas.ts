import { z } from "zod";

export const CreateSprintSchema = z.object({
  name: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  clientId: z.string(),
  // template: __fieldName__: z.__zodType__(),
});
export const UpdateSprintSchema = CreateSprintSchema.merge(
  z.object({
    id: z.number(),
  })
);

export const DeleteSprintSchema = z.object({
  id: z.number(),
});
