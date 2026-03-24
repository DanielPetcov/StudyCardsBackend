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

@Module({
  imports: [
    AiModule,
    CardModule,
    DatabaseModule,
    DeckModule,
    StorageModule,
    UserModule,

    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
