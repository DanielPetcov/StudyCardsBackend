import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

import { deckStatusesEnum, languagesEnum, deckIconEnum } from './enums';
import { user } from './user.schema';
import { file } from './file.schema';

export const deck = pgTable('deck', {
  id: uuid().defaultRandom().primaryKey(),

  userId: text()
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),

  title: varchar({ length: 255 }).notNull(),
  description: text(),

  fileId: uuid().references(() => file.id),

  cardCount: integer().notNull().default(0),
  cardsStudied: integer().notNull().default(0),

  language: languagesEnum().notNull().default('ro'),
  status: deckStatusesEnum().notNull().default('processing'),
  icon: deckIconEnum().notNull().default('book-open'), // ⭐ Added

  starred: boolean().notNull().default(false), // ⭐ Added
  archived: boolean().notNull().default(false), // ⭐ Added
  archivedAt: timestamp(), // ⭐ Added
  lastAccessedAt: timestamp(), // ⭐ Added

  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export type DeckEntity = typeof deck.$inferSelect;
export type DeckInsert = typeof deck.$inferInsert;
