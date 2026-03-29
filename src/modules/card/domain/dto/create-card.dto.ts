import { CardDifficulty } from '@/common/enums';

export class CreateCardDto {
  question: string;
  explanation: string;
  difficulty: CardDifficulty;
  order: number;
}
