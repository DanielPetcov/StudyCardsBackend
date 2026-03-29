export const deckStatuses = ['processing', 'ready', 'failed'] as const;

export type DeckStatuseType = (typeof deckStatuses)[number];
