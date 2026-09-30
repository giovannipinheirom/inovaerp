export const TASK_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  WAITING: 'waiting',
  IN_REVIEW: 'in_review',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  draft: 'Rascunho',
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  waiting: 'Aguardando',
  in_review: 'Em Revisão',
  completed: 'Concluída',
  cancelled: 'Cancelada',
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  draft: '#8D8D8D',
  pending: '#0F62FE',
  in_progress: '#8A3FFC',
  waiting: '#F1C21B',
  in_review: '#FF832B',
  completed: '#24A148',
  cancelled: '#DA1E28',
};
