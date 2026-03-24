const deckStatuses = ['processing', 'ready', 'failed'] as const;
export type DeckStatusesEnum = (typeof deckStatuses)[number];
