import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MaxLength,
  IsUrl,
  IsNumber,
} from 'class-validator';
import { LanguagesEnum, DeckIconEnum } from '@/common/enums';

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  pdfUrl: string;

  @IsEnum(LanguagesEnum)
  @IsOptional()
  language?: LanguagesEnum;

  @IsEnum(DeckIconEnum)
  @IsOptional()
  icon?: DeckIconEnum;

  @IsNumber()
  @IsOptional()
  cardCount?: number;
}
