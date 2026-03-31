import { CardDifficulty, DeckIconName } from '@/common/enums';

// What AI returns
export class AIDeckAnalysisDto {
  title: string;
  description: string;
  icon: DeckIconName;
  cards: AICardDto[];
}

export class AICardDto {
  question: string;
  difficulty: CardDifficulty;
  order: number;
  options: AICardOptionDto[]; // ⭐ 4 options per card
}

export class AICardOptionDto {
  text: string;
  isCorrect: boolean;
  explanation?: string; // Only for correct answer
  order: number;
}
