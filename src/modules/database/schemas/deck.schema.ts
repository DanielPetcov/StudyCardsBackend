import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

import { deckStatuses, languages } from './enums';
import { usersTable } from './users.schema';

export const decksTable = pgTable('decks', {
  id: uuid().defaultRandom().primaryKey(),

  userId: uuid()
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),

  title: varchar({ length: 255 }).notNull(),
  description: text(),

  pdfUrl: text().notNull(),
  cardCount: integer(),

  language: languages().notNull().default('ro'),
  status: deckStatuses().notNull().default('processing'),

  createdAt: timestamp().defaultNow(),
});
