import { ICardRepository } from '@/modules/card/domain/card.repository.interface';
import { DatabaseService } from '@/modules/database/database.service';

export class DrizzleCardRepository implements ICardRepository {
  constructor(private readonly _db: DatabaseService) {}

  createMany(deckId: string, createCardDto: string[]) {
    throw new Error('Method not implemented.');
  }
  findByDeck(deckId: string, userId: string) {
    throw new Error('Method not implemented.');
  }
  findById(id: string, userId: string) {
    throw new Error('Method not implemented.');
  }
}
