import { z } from 'zod';

export const CreateClientSchema = z.object({
  name: z.string().min(3, 'A razão social deve ter pelo menos 3 caracteres'),
  tradeName: z.string().optional(),
  document: z.string().min(11, 'Documento inválido (CNPJ/CPF)'),
  taxRegime: z.string(),
  ibgeCode: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const UpdateClientSchema = CreateClientSchema.partial();
