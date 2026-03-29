import { DeckInsert } from '@/modules/database/schemas';

import { CreateDeckDto } from './dto/deck-create.dto';

export class DeckMapper {
  static ToEntity(dto: CreateDeckDto, userId: string): DeckInsert {
    return {
      userId: userId,
      title: dto.title,
      description: dto.description ?? null,
      language: dto.language || 'en',
      icon: dto.icon || 'book-open',
      status: 'processing',
      cardCount: 0,
      cardsStudied: 0,
      starred: false,
      archived: false,
    };
  }
}
