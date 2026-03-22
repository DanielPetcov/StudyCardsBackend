import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DeckService } from './application/deck.service';
import { DeckController } from './presentation/deck.controller';
import { IDeckRepository } from './domain/deck.repository.interface';
import { DrizzleDeckRepository } from './infrastructure/drizzle/drizzle-deck.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    DeckService,
    {
      provide: IDeckRepository,
      useClass: DrizzleDeckRepository,
    },
  ],
  controllers: [DeckController],
})
export class DeckModule {}
