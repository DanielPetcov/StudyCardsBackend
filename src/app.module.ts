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
import { BullModule } from '@nestjs/bull';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    AiModule,
    CardModule,
    DatabaseModule,
    DeckModule,
    StorageModule,
    UserModule,
    FileModule,
    QueueModule,

    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD,
        tls: {},
      },
    }),
    AuthModule.forRoot({ auth, isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
