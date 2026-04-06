import { SubscriptionStatusesType } from '@/common/enums';
import { UpsertSubscriptionDto } from './dto/upsert-subscription.dto';

export const SUBSCRIPTION_REPOSITORY = 'SUBSCRIPTION_REPOSITORY';
export interface ISubscriptionRepository {
  upsertSubscription(dto: UpsertSubscriptionDto): Promise<void>;
  changeSubscriptionStatus(
    polarSubscriptionId: string,
    status: SubscriptionStatusesType,
  ): Promise<void>;
  findByPolarSubscriptionId(polarSubscriptionId: string);
}
