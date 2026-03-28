import { IsOptional, IsEnum } from 'class-validator';

import { LanguagesEnum } from '@/common/enums';

export class UploadDeckDto {
  @IsEnum(LanguagesEnum)
  @IsOptional()
  language?: LanguagesEnum; // For AI translation
}
