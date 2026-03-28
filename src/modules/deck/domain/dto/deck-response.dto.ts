import { DeckStatusesEnum, LanguagesEnum, DeckIconEnum } from '@/common/enums';

export class DeckResponseDto {
  id: string;
  title: string;
  description: string | null;

  pdfUrl: string;
  cardCount: number;
  cardsStudied: number;

  language: LanguagesEnum;
  status: DeckStatusesEnum;
  icon: DeckIconEnum; // ⭐ Added

  starred: boolean; // ⭐ Added
  archived: boolean; // ⭐ Added
  archivedAt: Date | null; // ⭐ Added
  lastAccessedAt: Date | null; // ⭐ Added

  createdAt: Date;
  updatedAt: Date;

  // userId - intentionally excluded for security
}
