import { PlanType, PlanEnum } from '@/common/enums';
import {
  MAXIMUM_FREE_ACTIVE_DECKS,
  MAXIMUM_FREE_CARDS_PER_DECK,
  MAXIMUM_PRO_ACTIVE_DECKS,
  MAXIMUM_PRO_CARDS_PER_DECK,
} from '@/constants';

export function getMaxCardsPerDeck(userPlan: PlanType): number {
  return userPlan === PlanEnum.FREE
    ? MAXIMUM_FREE_CARDS_PER_DECK
    : MAXIMUM_PRO_CARDS_PER_DECK;
}

export function getActiveDeckLimit(userPlan: PlanType): number {
  return userPlan === PlanEnum.FREE
    ? MAXIMUM_FREE_ACTIVE_DECKS
    : MAXIMUM_PRO_ACTIVE_DECKS;
}

import { UpsertSubscriptionDto } from '@/modules/subscription/domain/dto/upsert-subscription.dto';

export function mapPolarSubscriptionPayloadToDto(
  payload: any,
): UpsertSubscriptionDto | null {
  const externalId = payload?.data?.customer?.externalId;
  if (!externalId) return null;

  return {
    polarSubscriptionId: payload.data.id,
    userId: externalId,
    polarCustomerId: payload.data.customerId,
    polarProductId: payload.data.productId ?? null,
    status: payload.data.status,
    plan: 'pro',
    currentPeriodStart: payload.data.currentPeriodStart ?? null,
    currentPeriodEnd: payload.data.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: payload.data.cancelAtPeriodEnd ?? false,
    canceledAt: payload.data.canceledAt ?? null,
    revokedAt: payload.data.revokedAt ?? null,
  };
}
