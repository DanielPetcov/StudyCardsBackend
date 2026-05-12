import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { auth } from './auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { AiModule } from './modules/ai/ai.module';
import { CardModule } from './modules/card/card.module';
import { DatabaseModule } from './modules/database/database.module';
import { DeckModule } from './modules/deck/deck.module';
import { StorageModule } from './modules/storage/storage.module';
import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';
import { QueueModule } from './modules/queue/queue.module';
import { BullModule } from '@nestjs/bullmq';

import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { getRedisConnectionOptions } from './modules/queue/application/redis-connection';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRoot({
      connection: getRedisConnectionOptions(),
    }),
    AuthModule.forRoot({ auth, isGlobal: true }),

    AiModule,
    CardModule,
    DatabaseModule,
    DeckModule,
    StorageModule,
    UserModule,
    FileModule,
    QueueModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
