import {
  pgTable,
  integer,
  timestamp,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

import { languages, plans } from './enums';

export const user = pgTable('user', {
  // better auth fields - don't touch these
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  // custom added
  language: languages().notNull().default('ro'),
  uploadsUsed: integer().notNull().default(0),

  plan: plans().notNull().default('free'),
});
