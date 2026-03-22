import { pgEnum } from 'drizzle-orm/pg-core';

export const languages = pgEnum('languages', ['ro', 'ru', 'en']);

export const plans = pgEnum('plans', ['free', 'pro']);

export const cardDifficulties = pgEnum('cardDifficulties', [
  'easy',
  'mediu',
  'hard',
]);

export const deckStatuses = pgEnum('deckStatuses', [
  'processing',
  'ready',
  'failed',
]);
