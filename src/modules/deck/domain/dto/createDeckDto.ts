import { LanguagesEnum } from '@/common/enums';

export interface CreateDeckDto {
  userId: string;
  title: string;
  description: string | null;

  pdfUrl: string;
  cardCount: number;

  language: LanguagesEnum;
}
