import { pgTable, uuid, text, boolean, integer } from 'drizzle-orm/pg-core';

import { card } from './card.schema';

export const cardOption = pgTable('card_option', {
  id: uuid('id').defaultRandom().primaryKey(),
  cardId: uuid('card_id')
    .references(() => card.id, { onDelete: 'cascade' })
    .notNull(),

  text: text('text').notNull(),
  isCorrect: boolean('is_correct').notNull(),
  explanation: text('explanation'),
  order: integer('order').notNull().default(0),
});
