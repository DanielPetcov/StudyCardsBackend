import { AICardDto } from '@/modules/ai/domain/dto/ai-deck-analysis.dto';
import type {
  LanguageType,
  DeckIconName,
  DeckStatuseType,
} from '@/common/enums';

// Internal DTO used by the service after AI analysis
export class CreateDeckInternalDto {
  userId: string;
  title: string;
  description: string;
  pdfUrl: string;
  language: LanguageType;
  icon: DeckIconName;
  status: DeckStatuseType;
  cards: AICardDto[];
}
