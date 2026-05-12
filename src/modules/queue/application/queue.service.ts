import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import { LanguageType, PlanType } from '@/common/enums';
import {
  DECK_PROCESSING_QUEUE,
  PROCESS_DECK_JOB,
} from './queue';

export interface DeckProcessingJobData {
  deckId: string;
  userId: string;
  userPlan: PlanType;
  fileId: string;
  fileKey: string;
  language: LanguageType;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(DECK_PROCESSING_QUEUE)
    private readonly deckQueue: Queue<DeckProcessingJobData>,
  ) {}

  async addDeckProcessingJob(data: DeckProcessingJobData): Promise<void> {
    this.logger.log(
      `Queue job add started | deckId=${data.deckId} userId=${data.userId}`,
    );

    const job = await this.deckQueue.add(PROCESS_DECK_JOB, data, {
      jobId: data.deckId,
    });

    this.logger.log(`Queue job added | jobId=${job.id} deckId=${data.deckId}`);
  }
}
