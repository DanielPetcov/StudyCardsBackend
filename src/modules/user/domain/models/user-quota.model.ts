import { getMaxCardsPerDeck } from '@/helpers';
import { PlanType, PlanEnum } from '@/common/enums';
import {
  MAXIMUM_FREE_ACTIVE_DECKS,
  MAXIMUM_FREE_UPLOADS,
  MAXIMUM_PRO_ACTIVE_DECKS,
} from '@/constants';

export class UserQuota {
  constructor(
    public readonly uploadsUsed: number,
    public readonly plan: PlanType,
    public readonly activeDecks: number,
  ) {}

  canUpload(): { allowed: boolean; reason?: string } {
    // Upload limit check (free only)
    if (
      this.plan === PlanEnum.FREE &&
      this.uploadsUsed >= MAXIMUM_FREE_UPLOADS
    ) {
      return {
        allowed: false,
        reason: 'Upload limit reached. Upgrade to Pro for unlimited uploads.',
      };
    }

    // Active deck limit check
    const activeDeckLimit =
      this.plan === PlanEnum.FREE
        ? MAXIMUM_FREE_ACTIVE_DECKS
        : MAXIMUM_PRO_ACTIVE_DECKS;

    if (this.activeDecks >= activeDeckLimit) {
      return {
        allowed: false,
        reason: `Maximum active decks reached (${activeDeckLimit}).`,
      };
    }

    return { allowed: true };
  }

  getMaxCardsPerDeck(): number {
    return getMaxCardsPerDeck(this.plan);
  }
}
