import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

import { deckStatuses, languages } from './enums';
import { user } from './user.schema';

export const deck = pgTable('deck', {
  id: uuid().defaultRandom().primaryKey(),

  userId: text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),

  title: varchar({ length: 255 }).notNull(),
  description: text(),

  pdfUrl: text().notNull(),
  cardCount: integer(),

  language: languages().notNull().default('ro'),
  status: deckStatuses().notNull().default('processing'),

  createdAt: timestamp().defaultNow(),
});
