export const DEPARTMENT = {
  FISCAL: 'fiscal',
  CONTABIL: 'contabil',
  PESSOAL: 'pessoal',
  SOCIETARIO: 'societario',
} as const;

export type Department = typeof DEPARTMENT[keyof typeof DEPARTMENT];

export const DEPARTMENT_LABELS: Record<Department, string> = {
  fiscal: 'Fiscal',
  contabil: 'Contábil',
  pessoal: 'Pessoal',
  societario: 'Societário',
};
