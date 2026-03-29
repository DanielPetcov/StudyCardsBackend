import { CardDifficulty } from '@/common/enums';

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');
export interface ICardRepository {
  bulkCreate(
    deckId: string,
    cards: Array<{
      question: string;
      explanation: string;
      difficulty: CardDifficulty;
      order: number;
    }>,
  ): Promise<void>;

  findByDeck(deckId: string): Promise<
    Array<{
      id: string;
      deckId: string;
      question: string;
      explanation: string;
      difficulty: CardDifficulty;
      order: number;
    }>
  >;

  findById(id: string): Promise<{
    id: string;
    deckId: string;
    question: string;
    explanation: string;
    difficulty: CardDifficulty;
    order: number;
  } | null>;

  delete(id: string): Promise<void>;
}
