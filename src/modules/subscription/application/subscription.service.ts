import { Inject, Injectable } from '@nestjs/common';
import {
  SUBSCRIPTION_REPOSITORY,
  type ISubscriptionRepository,
} from '../domain/subscription.interface';
import { UpsertSubscriptionDto } from '../domain/dto/upsert-subscription.dto';
import { UserService } from '@/modules/user/application/user.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly _repo: ISubscriptionRepository,
    private readonly _userService: UserService,
  ) {}

  async syncFromPolar(dto: UpsertSubscriptionDto): Promise<void> {
    await this._repo.upsertSubscription(dto);

    const shouldBePro = this.shouldUserHaveProAccess({
      status: dto.status,
      cancelAtPeriodEnd: dto.cancelAtPeriodEnd,
      currentPeriodEnd: dto.currentPeriodEnd,
    });

    await this._userService.updatePlan(
      dto.userId,
      shouldBePro ? 'pro' : 'free',
    );
  }

  private shouldUserHaveProAccess(input: {
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date | null;
  }): boolean {
    const now = new Date();

    if (input.status === 'active' || input.status === 'trialing') {
      return true;
    }

    if (
      input.status === 'canceled' &&
      input.cancelAtPeriodEnd &&
      input.currentPeriodEnd &&
      input.currentPeriodEnd > now
    ) {
      return true;
    }

    return false;
  }
}
