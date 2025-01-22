import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.string(),
  status: z.string(),
  deadline: z.string().datetime(),
  clientId: z.string(),
  // template: __fieldName__: z.__zodType__(),
});
export const UpdateTaskSchema = CreateTaskSchema.merge(
  z.object({
    id: z.number(),
  })
);

export const DeleteTaskSchema = z.object({
  id: z.number(),
});
