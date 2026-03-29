import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DeckService } from './application/deck.service';
import { DeckController } from './presentation/deck.controller';
import { DECK_REPOSITORY } from './domain/deck.repository.interface';
import { DrizzleDeckRepository } from './infrastructure/drizzle/drizzle-deck.repository';
import { QueueModule } from '../queue/queue.module';
import { FileModule } from '../file/file.module';
import { CardModule } from '../card/card.module';

@Module({
  imports: [
    DatabaseModule,
    FileModule,
    forwardRef(() => QueueModule),
    forwardRef(() => CardModule),
  ],
  providers: [
    DeckService,
    {
      provide: DECK_REPOSITORY,
      useClass: DrizzleDeckRepository,
    },
  ],
  controllers: [DeckController],
  exports: [DeckService, DECK_REPOSITORY],
})
export class DeckModule {}
