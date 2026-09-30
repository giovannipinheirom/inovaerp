import { z } from 'zod';

export const CreateTaskSchema = z.object({
  clientId: z.string(),
  templateId: z.string().optional(),
  title: z.string().min(3, 'O título é obrigatório'),
  description: z.string().optional(),
  status: z.string().default('draft'),
  priority: z.string().default('normal'),
  competence: z.string().optional(),
  dueDateLegal: z.date().optional(),
  dueDateInternal: z.date().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const TaskFilterSchema = z.object({
  status: z.string().optional(),
  priority: z.string().optional(),
  clientId: z.string().optional(),
});
