import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

import { deck } from './deck.schema';

import { cardDifficultiesEnum } from './enums';

export const card = pgTable('card', {
  id: uuid('id').defaultRandom().primaryKey(),

  deckId: uuid('deck_id')
    .references(() => deck.id, { onDelete: 'cascade' })
    .notNull(),
  question: text('question').notNull(),

  difficulty: cardDifficultiesEnum('difficulty').notNull(),
  order: integer('order').notNull().default(0),
});
