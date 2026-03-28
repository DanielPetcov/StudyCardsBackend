import { DeckResponseDto } from './dto/deck-response.dto';

import { DeckEntity, DeckInsert } from '@/modules/database/schemas';

import { DeckIconEnum, DeckStatusesEnum, LanguagesEnum } from '@/common/enums';
import { CreateDeckDto } from './dto/deck-create.dto';

export class DeckMapper {
  static ToResponseDto(deck: DeckEntity): DeckResponseDto {
    return {
      id: deck.id,
      title: deck.title,
      description: deck.description,
      pdfUrl: deck.pdfUrl,
      cardCount: deck.cardCount,
      cardsStudied: deck.cardsStudied,
      language: LanguagesEnum[deck.language],
      status: DeckStatusesEnum[deck.status],
      icon: DeckIconEnum[deck.icon],
      starred: deck.starred,
      archived: deck.archived,
      archivedAt: deck.archivedAt,
      lastAccessedAt: deck.lastAccessedAt,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    };
  }

  static ToEntity(dto: CreateDeckDto, userId: string): DeckInsert {
    return {
      userId: userId,
      title: dto.title,
      description: dto.description ?? null,
      pdfUrl: dto.pdfUrl,
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
