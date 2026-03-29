import { forwardRef, Module } from '@nestjs/common';
import { QueueService } from './application/queue.service';
import { BullModule } from '@nestjs/bull';
import { AiModule } from '../ai/ai.module';
import { CardModule } from '../card/card.module';
import { StorageModule } from '../storage/storage.module';
import { DeckModule } from '../deck/deck.module';
import { DeckProcessingProcessor } from './processors/deck-processing.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'deck-processing',
    }),
    AiModule,
    StorageModule,
    forwardRef(() => CardModule),
    forwardRef(() => DeckModule),
  ],
  providers: [QueueService, DeckProcessingProcessor],
  exports: [QueueService],
})
export class QueueModule {}
