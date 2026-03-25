import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { DeckService } from '@/modules/deck/application/deck.service';

import type { CreateDeckDto } from '@/modules/deck/domain/dto/createDeckDto';

@Controller('decks')
export class DeckController {
  constructor(private readonly _service: DeckService) {}

  @Get()
  async getAll() {}

  @Get(':id')
  async getById(@Param('id') id: string) {}

  @Post()
  async create(dto: CreateDeckDto) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {}

  @Get(':id/cards')
  async getCards(@Param('id') id: string) {}
}
