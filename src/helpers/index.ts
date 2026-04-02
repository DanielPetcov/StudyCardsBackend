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
