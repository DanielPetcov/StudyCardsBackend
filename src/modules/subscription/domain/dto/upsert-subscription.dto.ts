import { PlanType, SubscriptionStatusesType } from '@/common/enums';

export interface UpsertSubscriptionDto {
  polarSubscriptionId: string;
  userId: string;
  polarCustomerId: string;
  polarProductId: string | null;
  status: SubscriptionStatusesType;
  plan: PlanType;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  revokedAt: Date | null;
}
