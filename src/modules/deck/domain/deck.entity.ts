import { LanguagesEnum, DeckStatusesEnum } from '@/common/enums';

export interface DeckEntity {
  id: string;
  userId: string;

  title: string;
  description: string | null;

  pdfUrl: string;
  cardCount: number;

  language: LanguagesEnum;
  status: DeckStatusesEnum;

  createdAt: Date;
}
