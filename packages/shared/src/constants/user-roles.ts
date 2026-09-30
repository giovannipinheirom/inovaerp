export const USER_ROLE = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  ANALYST: 'analyst',
  ASSISTANT: 'assistant',
  INTERN: 'intern',
  CLIENT: 'client',
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  manager: 'Gerente',
  supervisor: 'Supervisor',
  analyst: 'Analista',
  assistant: 'Assistente',
  intern: 'Estagiário',
  client: 'Cliente',
};
