import { DatabaseService } from '@/modules/database/database.service';
import { ISubscriptionRepository } from '../../domain/subscription.interface';
import { subscription } from '@/modules/database/schemas/subscriptions.schema';
import { UpsertSubscriptionDto } from '../../domain/dto/upsert-subscription.dto';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import { SubscriptionStatusesType } from '@/common/enums';

@Injectable()
export class DrizzleSubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly _db: DatabaseService) {}

  async upsertSubscription(dto: UpsertSubscriptionDto): Promise<void> {
    console.log('THIS IS STATUS: ', dto.status);

    await this._db.db
      .insert(subscription)
      .values({
        polarSubscriptionId: dto.polarSubscriptionId,
        userId: dto.userId,
        polarCustomerId: dto.polarCustomerId,
        polarProductId: dto.polarProductId,
        status: dto.status,
        plan: dto.plan,
        currentPeriodStart: dto.currentPeriodStart,
        currentPeriodEnd: dto.currentPeriodEnd,
        cancelAtPeriodEnd: dto.cancelAtPeriodEnd,
        canceledAt: dto.canceledAt,
        revokedAt: dto.revokedAt,
      })
      .onConflictDoUpdate({
        target: subscription.polarSubscriptionId,
        set: {
          polarCustomerId: dto.polarCustomerId,
          polarProductId: dto.polarProductId,
          status: dto.status,
          plan: dto.plan,
          currentPeriodStart: dto.currentPeriodStart,
          currentPeriodEnd: dto.currentPeriodEnd,
          cancelAtPeriodEnd: dto.cancelAtPeriodEnd,
          canceledAt: dto.canceledAt,
          revokedAt: dto.revokedAt,
          updatedAt: new Date(),
        },
      });
  }

  async changeSubscriptionStatus(
    polarSubscriptionId: string,
    status: SubscriptionStatusesType,
  ): Promise<void> {
    await this._db.db
      .update(subscription)
      .set({
        status: status,
        updatedAt: new Date(),
      })
      .where(eq(subscription.polarSubscriptionId, polarSubscriptionId));
  }

  async findByPolarSubscriptionId(polarSubscriptionId: string) {
    const [result] = await this._db.db
      .select()
      .from(subscription)
      .where(eq(subscription.polarSubscriptionId, polarSubscriptionId))
      .limit(1);

    return result ?? null;
  }
}
