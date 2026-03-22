import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

import { languages, plans } from './enums';

export const usersTable = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),

  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),

  language: languages().notNull().default('ro'),
  uploadsUsed: integer().notNull().default(0),

  plan: plans().notNull().default('free'),
  createdAt: timestamp().defaultNow(),
});
