import { Module } from '@nestjs/common';
import { SubscriptionService } from './application/subscription.service';
import { DatabaseModule } from '../database/database.module';
import { SUBSCRIPTION_REPOSITORY } from './domain/subscription.interface';
import { DrizzleSubscriptionRepository } from './infrastructure/drizzle/drizzle-subscription.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [
    SubscriptionService,
    {
      provide: SUBSCRIPTION_REPOSITORY,
      useClass: DrizzleSubscriptionRepository,
    },
  ],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
