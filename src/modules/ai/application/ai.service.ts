import { Injectable } from '@nestjs/common';

import { OpenRouter } from '@openrouter/sdk';

import { LanguagesEnum } from '@/common/enums';

@Injectable()
export class AiService {
  private readonly openrouter = new OpenRouter({
    apiKey: process.env.OPEN_ROUTER_KEY,
  });

  private readonly model = 'google/gemini-2.5-flash-lite';

  async generateCards(
    pdfBuffer: Buffer,
    language: LanguagesEnum,
    cardCount: number,
  ) {}

  buildPrompt(language: LanguagesEnum, cardCount): string {
    return '';
  }
}
