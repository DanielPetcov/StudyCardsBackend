import { pgEnum } from 'drizzle-orm/pg-core';

export const languagesEnum = pgEnum('languages', ['ro', 'ru', 'en']);

export const plansEnum = pgEnum('plans', ['free', 'pro']);

export const cardDifficultiesEnum = pgEnum('cardDifficulties', [
  'easy',
  'medium',
  'hard',
]);

export const deckStatusesEnum = pgEnum('deckStatuses', [
  'processing',
  'ready',
  'failed',
]);

export const deckIconEnum = pgEnum('deckIcons', [
  'book-open',
  'brain',
  'code',
  'flask',
  'dna',
  'atom',
  'calculator',
  'globe',
  'landmark',
  'scale',
  'briefcase',
  'palette',
  'music',
  'language',
  'heart',
  'cpu',
  'database',
  'chart',
  'rocket',
  'leaf',
  'microscope',
  'book',
  'theater',
  'gamepad',
  'clock',
]);
