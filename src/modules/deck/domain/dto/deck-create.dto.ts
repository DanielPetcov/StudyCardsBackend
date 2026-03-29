import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  MaxLength,
  IsNumber,
  IsUUID,
} from 'class-validator';
import {
  type LanguageType,
  languages,
  type DeckIconName,
  deckIconNames,
} from '@/common/enums';

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  fileId: string; // ⭐ Changed from pdfUrl to fileId

  @IsIn(languages)
  @IsOptional()
  language?: LanguageType;

  @IsIn(deckIconNames)
  @IsOptional()
  icon?: DeckIconName;

  @IsNumber()
  @IsOptional()
  cardCount?: number;
}
