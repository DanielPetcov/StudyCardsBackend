import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';

import { card } from './card.schema';

export const cardOption = pgTable('card_option', {
  id: uuid().defaultRandom().primaryKey(),
  cardId: uuid()
    .references(() => card.id, { onDelete: 'cascade' })
    .notNull(),

  text: text().notNull(),
  isCorrect: boolean().notNull(),
  explanation: text(),
});
