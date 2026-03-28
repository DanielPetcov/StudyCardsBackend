import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsEnum } from 'class-validator';

import { CreateDeckDto } from './deck-create.dto';
import { DeckStatusesEnum } from '@/common/enums';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {
  @IsBoolean()
  @IsOptional()
  starred?: boolean;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  @IsEnum(DeckStatusesEnum)
  @IsOptional()
  status?: DeckStatusesEnum;
}
