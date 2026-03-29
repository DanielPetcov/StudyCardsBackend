// modules/card/card.controller.ts
import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { CardService } from '../application/card.service';
import { CardResponseDto } from '../domain/dto/card-response.dto';

@Controller('cards')
export class CardController {
  constructor(private readonly _service: CardService) {}

  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<CardResponseDto> {
    const userId = req.user.id;
    return this._service.findById(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<void> {
    const userId = req.user.id;
    await this._service.delete(id, userId);
  }
}
