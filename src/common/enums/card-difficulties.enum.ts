export const cardDifficulties = ['easy', 'medium', 'hard'] as const;

export type CardDifficulty = (typeof cardDifficulties)[number];
