import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const file = pgTable('file', {
  id: uuid('id').defaultRandom().primaryKey(),

  fileKey: text('file_key').notNull(),
  originalFileName: text('original_file_name').notNull(),

  isPublic: boolean('is_public').notNull().default(false),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});
