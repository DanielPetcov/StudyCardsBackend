import { CardDifficulty } from '@/common/enums';
import { CardResponseDto } from './dto/card-response.dto';
import { CreateCardDto } from './dto/create-card.dto';

export const CARD_REPOSITORY = Symbol('CARD_REPOSITORY');
export interface ICardRepository {
  bulkCreate(deckId: string, cards: CreateCardDto[]): Promise<void>;

  findByDeck(deckId: string): Promise<CardResponseDto[]>;

  findById(id: string): Promise<CardResponseDto | null>;

  delete(id: string): Promise<void>;
}

export interface CardOptionData {
  id: string;
  cardId: string;
  text: string;
  isCorrect: boolean;
  explanation: string | null;
  order: number;
}

export interface CardData {
  id: string;
  deckId: string;
  question: string;
  difficulty: CardDifficulty;
  order: number;
  options: CardOptionData[]; // ⭐ Include options
}
