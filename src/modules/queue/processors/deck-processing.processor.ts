import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { forwardRef, Inject, Logger } from '@nestjs/common';

import { AiService } from '@/modules/ai/application/ai.service';
import { CardService } from '@/modules/card/application/card.service';
import { StorageService } from '@/modules/storage/application/storage.service';

import { DeckProcessingJobData } from '../application/queue.service';
import {
  DECK_REPOSITORY,
  type IDeckRepository,
} from '@/modules/deck/domain/deck.repository.interface';

@Processor('deck-processing')
export class DeckProcessingProcessor {
  private readonly logger = new Logger(DeckProcessingProcessor.name);

  constructor(
    private readonly _ai: AiService,
    private readonly _card: CardService,
    private readonly _storage: StorageService,
    @Inject(forwardRef(() => DECK_REPOSITORY))
    private readonly _deckRepo: IDeckRepository,
  ) {}

  @Process('process-deck')
  async processDeck(job: Job<DeckProcessingJobData>): Promise<void> {
    const { deckId, userId, userPlan, fileId, fileKey, language } = job.data;

    this.logger.log(
      `Process deck started | jobId=${job.id} deckId=${deckId} userId=${userId}`,
    );

    try {
      // 1. Download file
      this.logger.log(`Downloading file | deckId=${deckId} fileKey=${fileKey}`);

      const { url } = await this._storage.getSingedUrl(fileKey);
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      this.logger.log(
        `File downloaded | deckId=${deckId} size=${buffer.length}`,
      );

      // 2. AI analysis
      this.logger.log(`AI analysis started | deckId=${deckId}`);

      const aiAnalysis = await this._ai.analyzeDeck(userPlan, buffer, language);

      this.logger.log(
        `AI analysis completed | deckId=${deckId} cards=${aiAnalysis.cards.length} icon=${aiAnalysis.icon}`,
      );

      // 3. Update deck
      this.logger.log(`Updating deck | deckId=${deckId} status=ready`);

      await this._deckRepo.update(deckId, userId, {
        title: aiAnalysis.title,
        description: aiAnalysis.description,
        icon: aiAnalysis.icon,
        cardCount: aiAnalysis.cards.length,
        status: 'ready',
      });

      this.logger.log(`Deck updated | deckId=${deckId}`);

      // 4. Create cards
      this.logger.log(
        `Bulk create cards started | deckId=${deckId} count=${aiAnalysis.cards.length}`,
      );

      await this._card.bulkCreate(deckId, aiAnalysis.cards);

      this.logger.log(`Bulk create cards completed | deckId=${deckId}`);

      this.logger.log(
        `Process deck completed | jobId=${job.id} deckId=${deckId}`,
      );
    } catch (error) {
      this.logger.error(
        `Process deck failed | jobId=${job.id} deckId=${deckId}`,
        error.stack,
      );

      await this._deckRepo.updateStatus(deckId, 'failed');

      this.logger.warn(`Deck marked as failed | deckId=${deckId}`);

      throw error;
    }
  }
}
