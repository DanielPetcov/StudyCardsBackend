import { Injectable, NotImplementedException } from '@nestjs/common';

import { OpenRouter } from '@openrouter/sdk';

import { DeckIconEnum, LanguagesEnum } from '@/common/enums';
import { CardResponseDto } from '@/modules/card/domain/dto/card-response.dto';

@Injectable()
export class AiService {
  private readonly openrouter = new OpenRouter({
    apiKey: process.env.OPEN_ROUTER_KEY,
  });

  private readonly model = 'google/gemini-2.5-flash-lite';

  async analyzeDeck(
    buffer: Buffer,
    language: LanguagesEnum,
  ): Promise<{
    title: string;
    description: string;
    icon: DeckIconEnum;
    cards: CardResponseDto[];
  }> {
    throw new NotImplementedException();
  }
}
