import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@/modules/card/domain/card.repository.interface';

@Injectable()
export class CardService {
  constructor(private readonly _repo: ICardRepository) {}

  async createMany(deckId: string, createCardDto: string[]) {}
  async findByDeck(deckId: string, userId: string) {}
  async findById(id: string, userId: string) {}
}
