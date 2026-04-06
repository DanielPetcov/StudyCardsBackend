import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { user } from './user.schema';
import { plansEnum, subscriptionStatusEnum } from './enums';

export const subscription = pgTable('subscription', {
  polarSubscriptionId: text('polar_subscription_id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  polarCustomerId: text('polar_customer_id').notNull(),
  polarProductId: text('polar_product_id'),
  polarOrderId: text('polar_order_id'),

  status: subscriptionStatusEnum('status').notNull(),
  plan: plansEnum('plan').notNull().default('free'),

  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),

  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  canceledAt: timestamp('canceled_at'),
  revokedAt: timestamp('revoked_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
