import { Inject, Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';

import { AiService } from '@/modules/ai/application/ai.service';
import { CardService } from '@/modules/card/application/card.service';
import { StorageService } from '@/modules/storage/application/storage.service';
import {
  DECK_REPOSITORY,
  type IDeckRepository,
} from '@/modules/deck/domain/deck.repository.interface';
import { UserService } from '@/modules/user/application/user.service';

import { DeckProcessingJobData } from '../application/queue.service';
import {
  DECK_PROCESSING_QUEUE,
  PROCESS_DECK_JOB,
  deckProcessingWorkerOptions,
} from '../application/queue';

@Processor(DECK_PROCESSING_QUEUE, deckProcessingWorkerOptions)
export class DeckProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(DeckProcessingProcessor.name);
  private lastWorkerErrorLoggedAt = 0;

  constructor(
    private readonly _ai: AiService,
    private readonly _card: CardService,
    private readonly _storage: StorageService,
    private readonly _user: UserService,
    @Inject(DECK_REPOSITORY)
    private readonly _deckRepo: IDeckRepository,
  ) {
    super();
  }

  async process(job: Job<DeckProcessingJobData, void, string>): Promise<void> {
    switch (job.name) {
      case PROCESS_DECK_JOB:
        return this.processDeck(job);
      default:
        throw new Error(`Unsupported queue job: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<DeckProcessingJobData>): void {
    this.logger.log(`Queue job completed | jobId=${job.id} deckId=${job.data.deckId}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<DeckProcessingJobData> | undefined, error: Error): void {
    this.logger.error(
      `Queue job failed | jobId=${job?.id ?? 'unknown'} deckId=${job?.data?.deckId ?? 'unknown'}`,
      error.stack,
    );
  }

  @OnWorkerEvent('stalled')
  onStalled(jobId: string): void {
    this.logger.warn(`Queue job stalled | jobId=${jobId}`);
  }

  @OnWorkerEvent('error')
  onWorkerError(error: Error): void {
    const now = Date.now();
    if (now - this.lastWorkerErrorLoggedAt < 10_000) return;

    this.lastWorkerErrorLoggedAt = now;
    this.logger.error('Deck processing worker error', error.stack);
  }

  private async processDeck(
    job: Job<DeckProcessingJobData, void, string>,
  ): Promise<void> {
    const { deckId, userId, userPlan, fileKey, language } = job.data;

    this.logger.log(
      `Process deck started | jobId=${job.id} deckId=${deckId} userId=${userId}`,
    );

    try {
      await job.updateProgress(10);

      this.logger.log(`Downloading file | deckId=${deckId} fileKey=${fileKey}`);

      const { url } = await this._storage.getSignedUrl(fileKey);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to download file from storage: ${response.status} ${response.statusText}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      this.logger.log(`File downloaded | deckId=${deckId} size=${buffer.length}`);
      await job.updateProgress(30);

      this.logger.log(`AI analysis started | deckId=${deckId}`);

      const aiAnalysis = await this._ai.analyzeDeck(userPlan, buffer, language);

      this.logger.log(
        `AI analysis completed | deckId=${deckId} cards=${aiAnalysis.cards.length} icon=${aiAnalysis.icon}`,
      );
      await job.updateProgress(70);

      this.logger.log(`Updating deck metadata | deckId=${deckId}`);

      await this._deckRepo.update(deckId, userId, {
        title: aiAnalysis.title,
        description: aiAnalysis.description,
        icon: aiAnalysis.icon,
        cardCount: aiAnalysis.cards.length,
      });

      this.logger.log(`Deck metadata updated | deckId=${deckId}`);

      this.logger.log(
        `Bulk create cards started | deckId=${deckId} count=${aiAnalysis.cards.length}`,
      );

      await this._card.bulkCreate(deckId, aiAnalysis.cards);

      this.logger.log(`Bulk create cards completed | deckId=${deckId}`);
      await job.updateProgress(90);

      await this._user.incrementUploads(userId);

      this.logger.log(`User uploads incremented | userId=${userId}`);

      await this._deckRepo.updateStatus(deckId, 'ready');

      this.logger.log(`Deck marked as ready | deckId=${deckId}`);
      await job.updateProgress(100);

      this.logger.log(
        `Process deck completed | jobId=${job.id} deckId=${deckId}`,
      );
    } catch (error) {
      this.logger.error(
        `Process deck failed | jobId=${job.id} deckId=${deckId}`,
        error instanceof Error ? error.stack : String(error),
      );

      await this._deckRepo.updateStatus(deckId, 'failed');

      this.logger.warn(`Deck marked as failed | deckId=${deckId}`);

      throw error;
    }
  }
}
