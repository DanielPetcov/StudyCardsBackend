import { forwardRef, Module } from '@nestjs/common';
import { CardService } from './application/card.service';
import { DatabaseModule } from '../database/database.module';
import { CARD_REPOSITORY } from './domain/card.repository.interface';
import { DrizzleCardRepository } from './infrastructure/drizzle/drizzle-card.repository';
import { DeckModule } from '../deck/deck.module';
import { CardController } from './presentation/card.controller';

@Module({
  imports: [DatabaseModule, forwardRef(() => DeckModule)],
  providers: [
    CardService,
    {
      provide: CARD_REPOSITORY,
      useClass: DrizzleCardRepository,
    },
  ],
  controllers: [CardController],
  exports: [CardService, CARD_REPOSITORY],
})
export class CardModule {}
