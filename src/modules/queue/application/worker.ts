/**
 * The deck-processing worker is now managed by Nest through
 * DeckProcessingProcessor and @nestjs/bullmq.
 *
 * Keep queue processing inside the Nest container so the worker can use the
 * existing AiService, CardService, StorageService, UserService, and deck
 * repository dependencies instead of duplicating that flow in a standalone
 * BullMQ Worker instance.
 */
export {};
