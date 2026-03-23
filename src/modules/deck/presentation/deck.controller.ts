import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';

import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { DeckService } from '@_modules/deck/application/deck.service';

@Controller('deck')
export class DeckController {
  constructor(private readonly _deckService: DeckService) {}

  @Get(':telegramId')
  @AllowAnonymous()
  async getDeck(@Param('telegramId') telegramId: number) {
    if (isNaN(telegramId)) {
      throw new HttpException('Invalid param type', HttpStatus.NOT_ACCEPTABLE);
    }

    console.log(telegramId);
  }
}
