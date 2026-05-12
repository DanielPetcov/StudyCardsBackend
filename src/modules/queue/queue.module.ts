import { forwardRef, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { AiModule } from '../ai/ai.module';
import { CardModule } from '../card/card.module';
import { DeckModule } from '../deck/deck.module';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from '../user/user.module';
import { QueueService } from './application/queue.service';
import { DeckProcessingProcessor } from './processors/deck-processing.processor';
import {
  DECK_PROCESSING_QUEUE,
  deckProcessingDefaultJobOptions,
} from './application/queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: DECK_PROCESSING_QUEUE,
      defaultJobOptions: deckProcessingDefaultJobOptions,
    }),
    AiModule,
    StorageModule,
    UserModule,
    forwardRef(() => CardModule),
    forwardRef(() => DeckModule),
  ],
  providers: [QueueService, DeckProcessingProcessor],
  exports: [QueueService],
})
export class QueueModule {}
