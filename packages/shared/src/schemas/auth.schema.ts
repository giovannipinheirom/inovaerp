import { z } from 'zod';

export const LoginInputSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export const RegisterInputSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
});

export const TokenPayloadSchema = z.object({
  userId: z.string(),
  tenantId: z.string(),
  role: z.string(),
});
