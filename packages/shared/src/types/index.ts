import { z } from 'zod';
import * as schemas from '../schemas';

export type LoginInput = z.infer<typeof schemas.LoginInputSchema>;
export type RegisterInput = z.infer<typeof schemas.RegisterInputSchema>;
export type TokenPayload = z.infer<typeof schemas.TokenPayloadSchema>;

export type CreateClient = z.infer<typeof schemas.CreateClientSchema>;
export type UpdateClient = z.infer<typeof schemas.UpdateClientSchema>;

export type CreateTask = z.infer<typeof schemas.CreateTaskSchema>;
export type UpdateTask = z.infer<typeof schemas.UpdateTaskSchema>;
export type TaskFilter = z.infer<typeof schemas.TaskFilterSchema>;

export type CreateUser = z.infer<typeof schemas.CreateUserSchema>;
export type UpdateUser = z.infer<typeof schemas.UpdateUserSchema>;
