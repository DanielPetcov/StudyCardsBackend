import { CardDifficulty } from '@/common/enums';

export class CardOptionResponseDto {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string | null;
  order: number;
}

export class CardResponseDto {
  id: string;
  deckId: string;
  question: string;
  difficulty: CardDifficulty;
  order: number;
  options: CardOptionResponseDto[];
}
