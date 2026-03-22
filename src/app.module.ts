import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { auth } from './auth';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { DatabaseModule } from './modules/database/database.module';
import { DeckModule } from './modules/deck/deck.module';

@Module({
  imports: [
    DatabaseModule,
    DeckModule,
    AuthModule.forRoot({ auth }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
