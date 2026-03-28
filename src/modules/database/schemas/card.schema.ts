import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

import { deck } from './deck.schema';

import { cardDifficultiesEnum } from './enums';

export const card = pgTable('card', {
  id: uuid().defaultRandom().primaryKey(),

  deckId: uuid()
    .references(() => deck.id, { onDelete: 'cascade' })
    .notNull(),
  question: text().notNull(),
  explanation: text().notNull(),

  difficulty: cardDifficultiesEnum().notNull(),
  order: integer().notNull().default(0),
});
