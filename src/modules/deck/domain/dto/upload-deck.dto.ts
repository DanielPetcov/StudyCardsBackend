import { IsOptional, IsIn } from 'class-validator';

import { type LanguageType, languages } from '@/common/enums';

export class UploadDeckDto {
  @IsIn(languages)
  @IsOptional()
  language?: LanguageType; // For AI translation
}
