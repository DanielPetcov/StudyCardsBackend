import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';

import { cardsTable } from './card.schema';

export const cardOptionsTable = pgTable('card_options', {
  id: uuid().defaultRandom().primaryKey(),
  cardId: uuid()
    .references(() => cardsTable.id, { onDelete: 'cascade' })
    .notNull(),

  text: text().notNull(),
  isCorrect: boolean().notNull(),
  explanation: text(),
});
