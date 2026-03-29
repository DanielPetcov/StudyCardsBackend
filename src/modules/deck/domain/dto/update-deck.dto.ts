import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsIn } from 'class-validator';

import { CreateDeckDto } from './deck-create.dto';
import { type DeckStatuseType, deckStatuses } from '@/common/enums';

export class UpdateDeckDto extends PartialType(CreateDeckDto) {
  @IsBoolean()
  @IsOptional()
  starred?: boolean;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  @IsIn(deckStatuses)
  @IsOptional()
  status?: DeckStatuseType;
}
