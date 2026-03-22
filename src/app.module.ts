import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
