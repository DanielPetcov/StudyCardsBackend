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
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),

  title: varchar('title', { length: 255 }).notNull(),
  description: text(),

  fileId: uuid('file_id').references(() => file.id),

  cardCount: integer('card_count').notNull().default(0),
  cardsStudied: integer('cards_studied').notNull().default(0),

  language: languagesEnum('language').notNull().default('ro'),
  status: deckStatusesEnum('status').notNull().default('processing'),
  icon: deckIconEnum('icon').notNull().default('book-open'), // ⭐ Added

  starred: boolean('starred').notNull().default(false), // ⭐ Added
  archived: boolean('archived').notNull().default(false), // ⭐ Added
  archivedAt: timestamp('archived_at'), // ⭐ Added
  lastAccessedAt: timestamp('last_accessed_at'), // ⭐ Added

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type DeckEntity = typeof deck.$inferSelect;
export type DeckInsert = typeof deck.$inferInsert;
