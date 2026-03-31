import {
  pgTable,
  integer,
  timestamp,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

import { languagesEnum, plansEnum } from './enums';

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
  language: languagesEnum('language').notNull().default('ro'),
  uploadsUsed: integer('uploads_used').notNull().default(0),

  plan: plansEnum('plan').notNull().default('free'),
});

export type UserEntity = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;
