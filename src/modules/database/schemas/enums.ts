import { pgEnum } from 'drizzle-orm/pg-core';

export const languagesEnum = pgEnum('languages', ['ro', 'ru', 'en']);

export const plansEnum = pgEnum('plans', ['free', 'pro']);

export const cardDifficultiesEnum = pgEnum('cardDifficulties', [
  'easy',
  'mediu',
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
  'clock',
  'star',
  'archive',
]);
