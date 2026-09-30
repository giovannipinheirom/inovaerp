import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.string(),
  fullName: z.string(),
  phone: z.string().optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
