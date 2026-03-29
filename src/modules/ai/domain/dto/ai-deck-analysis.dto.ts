import { DeckIconName } from '@/common/enums';

// What AI returns
export class AIDeckAnalysisDto {
  title: string;
  description: string;
  icon: DeckIconName;
  cards: AICardDto[];
}

export class AICardDto {
  front: string;
  back: string;
  page?: number;
  confidence?: number;
}
