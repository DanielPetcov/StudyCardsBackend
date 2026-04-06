const subscriptionStatuses = [
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'revoked',
  'unpaid',
] as const;

export type SubscriptionStatusesType = (typeof subscriptionStatuses)[number];
export enum SubscriptionStatusesEnum {
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  REVOKED = 'revoked',
  UNPAID = 'unpaid',
}
