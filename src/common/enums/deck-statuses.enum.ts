const deckStatuses = ['processing', 'ready', 'failed'] as const;
export type DeckStatusesEnumType = (typeof deckStatuses)[number];
export enum DeckStatusesEnum {
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}
