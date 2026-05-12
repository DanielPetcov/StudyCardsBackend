import type { JobsOptions } from 'bullmq';

export const DECK_PROCESSING_QUEUE = 'deck-processing';
export const PROCESS_DECK_JOB = 'process-deck';

export const deckProcessingDefaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2_000,
  },
  removeOnComplete: true,
  removeOnFail: false,
};

const drainDelaySeconds = Number(process.env.QUEUE_DRAIN_DELAY_SECONDS ?? 60);

export const deckProcessingWorkerOptions = {
  concurrency: 1,
  drainDelay:
    Number.isFinite(drainDelaySeconds) && drainDelaySeconds > 0
      ? drainDelaySeconds
      : 60,
  stalledInterval: 300_000,
  maxStalledCount: 1,
  removeOnComplete: {
    count: 1_000,
  },
  removeOnFail: {
    count: 500,
  },
};
