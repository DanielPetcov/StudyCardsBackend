import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { ICardRepository } from '../../domain/card.repository.interface';
import { DatabaseService } from '@/modules/database/database.service';
import { card, cardOption } from '@/modules/database/schemas';

import { CreateCardDto } from '../../domain/dto/create-card.dto';

@Injectable()
export class DrizzleCardRepository implements ICardRepository {
  constructor(private readonly _db: DatabaseService) {}

  async bulkCreate(deckId: string, cards: CreateCardDto[]): Promise<void> {
    // 1. Prepare cards for insertion
    const cardsToInsert = cards.map((c) => ({
      deckId,
      question: c.question,
      difficulty: c.difficulty,
      order: c.order,
    }));

    // 2. Insert all cards and get their IDs back
    const insertedCards = await this._db.db
      .insert(card)
      .values(cardsToInsert)
      .returning();

    // 3. Flatten all card options with their corresponding cardId
    const cardOptionsToInsert = insertedCards.flatMap((insertedCard, index) => {
      const cardData = cards[index];
      return cardData.options.map((option) => ({
        cardId: insertedCard.id,
        text: option.text,
        isCorrect: option.isCorrect,
        explanation: option.explanation || null,
        order: option.order,
      }));
    });

    // 4. Bulk insert all card options
    if (cardOptionsToInsert.length > 0) {
      await this._db.db.insert(cardOption).values(cardOptionsToInsert);
    }
  }

  async findByDeck(deckId: string) {
    const cardsWithOptions = await this._db.db.query.card.findMany({
      where: eq(card.deckId, deckId),
      orderBy: (cards, { asc }) => [asc(cards.order)],
      with: {
        options: {
          orderBy: (options, { asc }) => [asc(options.order)],
        },
      },
    });
    return cardsWithOptions;
  }

  async findById(id: string) {
    const cardWithOptions = await this._db.db.query.card.findFirst({
      where: eq(card.id, id),
      with: {
        options: {
          orderBy: (options, { asc }) => [asc(options.order)],
        },
      },
    });

    return cardWithOptions || null;
  }

  async delete(id: string): Promise<void> {
    await this._db.db.delete(card).where(eq(card.id, id));
  }
}
