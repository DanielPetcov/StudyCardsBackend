import { Module } from '@nestjs/common';
import { CardService } from './application/card.service';
import { DatabaseModule } from '../database/database.module';
import { ICardRepository } from './domain/card.repository.interface';
import { DrizzleCardRepository } from './infrastructure/drizzle/drizzle-card.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    CardService,
    {
      provide: ICardRepository,
      useClass: DrizzleCardRepository,
    },
  ],
})
export class CardModule {}
