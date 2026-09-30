export type TaskStatus = 'draft' | 'pending' | 'in_progress' | 'waiting' | 'in_review' | 'completed' | 'cancelled';

const transitions: Record<string, TaskStatus[]> = {
  'draft': ['pending'],
  'pending': ['in_progress', 'cancelled'],
  'in_progress': ['waiting', 'in_review', 'completed', 'cancelled'],
  'waiting': ['in_progress', 'cancelled'],
  'in_review': ['in_progress', 'completed'],
  'completed': [],
  'cancelled': []
};

export function getAvailableTransitions(from: string): TaskStatus[] {
  return transitions[from] || [];
}

export function canTransition(from: string, to: string): boolean {
  const available = getAvailableTransitions(from);
  return available.includes(to as TaskStatus);
}
