export const TAX_REGIME = {
  SIMPLES_NACIONAL: 'simples_nacional',
  LUCRO_PRESUMIDO: 'lucro_presumido',
  LUCRO_REAL: 'lucro_real',
  MEI: 'mei',
} as const;

export type TaxRegime = typeof TAX_REGIME[keyof typeof TAX_REGIME];

export const TAX_REGIME_LABELS: Record<TaxRegime, string> = {
  simples_nacional: 'Simples Nacional',
  lucro_presumido: 'Lucro Presumido',
  lucro_real: 'Lucro Real',
  mei: 'MEI',
};
