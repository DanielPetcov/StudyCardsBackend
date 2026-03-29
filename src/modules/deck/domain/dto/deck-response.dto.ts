import type {
  LanguageType,
  DeckIconName,
  DeckStatuseType,
} from '@/common/enums';

export class DeckResponseDto {
  id: string;
  title: string;
  description: string | null;

  pdfUrl: string; // ⭐ Signed URL generated on-the-fly
  fileId: string; // ⭐ Added for reference
  cardCount: number;
  cardsStudied: number;

  language: LanguageType;
  status: DeckStatuseType;
  icon: DeckIconName; // ⭐ Added

  starred: boolean; // ⭐ Added
  archived: boolean; // ⭐ Added
  archivedAt: Date | null; // ⭐ Added
  lastAccessedAt: Date | null; // ⭐ Added

  createdAt: Date;
  updatedAt: Date;

  // userId - intentionally excluded for security
}
