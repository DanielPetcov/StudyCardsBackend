import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const file = pgTable('file', {
  id: uuid().defaultRandom().primaryKey(),

  fileKey: text().notNull(),
  originalFileName: text().notNull(),

  isPublic: boolean().notNull().default(false),
  uploadedAt: timestamp().defaultNow().notNull(),
});
