import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ICardRepository } from '../../domain/card.repository.interface';
import { DatabaseService } from '@/modules/database/database.service';
import { card } from '@/modules/database/schemas';
import { CardDifficulty } from '@/common/enums';

@Injectable()
export class DrizzleCardRepository implements ICardRepository {
  constructor(private readonly _db: DatabaseService) {}

  async bulkCreate(
    deckId: string,
    cards: Array<{
      question: string;
      explanation: string;
      difficulty: CardDifficulty;
      order: number;
    }>,
  ): Promise<void> {
    // Prepare bulk insert data
    const cardsToInsert = cards.map((c) => ({
      deckId,
      question: c.question,
      explanation: c.explanation,
      difficulty: c.difficulty,
      order: c.order,
    }));

    // Bulk insert all cards at once
    await this._db.db.insert(card).values(cardsToInsert);
  }

  async findByDeck(deckId: string) {
    const cards = await this._db.db
      .select()
      .from(card)
      .where(eq(card.deckId, deckId))
      .orderBy(card.order); // ⭐ Return in logical order

    return cards;
  }

  async findById(id: string) {
    const [result] = await this._db.db
      .select()
      .from(card)
      .where(eq(card.id, id));

    return result || null;
  }

  async delete(id: string): Promise<void> {
    await this._db.db.delete(card).where(eq(card.id, id));
  }
}
