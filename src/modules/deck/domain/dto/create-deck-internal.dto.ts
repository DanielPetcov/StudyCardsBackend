import { AICardDto } from '@/modules/ai/domain/dto/ai-deck-analysis.dto';
import { LanguagesEnum, DeckIconEnum, DeckStatusesEnum } from '@/common/enums';

// Internal DTO used by the service after AI analysis
export class CreateDeckInternalDto {
  userId: string;
  title: string;
  description: string;
  pdfUrl: string;
  language: LanguagesEnum;
  icon: DeckIconEnum;
  status: DeckStatusesEnum;
  cards: AICardDto[];
}
