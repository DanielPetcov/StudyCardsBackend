import { pgTable, uuid, text, integer } from 'drizzle-orm/pg-core';

import { decksTable } from './deck.schema';
import { cardDifficulties } from './enums';

export const cardsTable = pgTable('cards', {
  id: uuid().defaultRandom().primaryKey(),

  deckId: uuid()
    .references(() => decksTable.id, { onDelete: 'cascade' })
    .notNull(),
  question: text().notNull(),
  explanation: text().notNull(),

  difficulty: cardDifficulties().notNull(),
  order: integer().notNull(),
});
