import { CardDifficulty } from '@/common/enums';

export class CreateCardOptionDto {
  text: string;
  isCorrect: boolean;
  explanation?: string;
  order: number;
}

export class CreateCardDto {
  question: string;
  difficulty: CardDifficulty;
  order: number;
  options: CreateCardOptionDto[];
}
