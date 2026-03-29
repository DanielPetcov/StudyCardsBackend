import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { LanguageType } from '@/common/enums';

export interface DeckProcessingJobData {
  deckId: string;
  userId: string;
  fileId: string;
  fileKey: string;
  language: LanguageType;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue('deck-processing') private readonly queue: Queue) {}

  async addDeckProcessingJob(data: DeckProcessingJobData): Promise<void> {
    this.logger.log(
      `Queue job started | deckId=${data.deckId} userId=${data.userId} fileId=${data.fileId}`,
    );

    try {
      const job = await this.queue.add('process-deck', data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      });

      this.logger.log(
        `Queue job added | jobId=${job.id} deckId=${data.deckId}`,
      );
    } catch (error) {
      this.logger.error(
        `Queue job failed | deckId=${data.deckId} userId=${data.userId}`,
        error.stack,
      );
      throw error;
    }
  }
}
