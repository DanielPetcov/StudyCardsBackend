import { Injectable, NotImplementedException } from '@nestjs/common';
import { ICardRepository } from '@/modules/card/domain/card.repository.interface';
import { CardResponseDto } from '../domain/dto/card-response.dto';

@Injectable()
export class CardService {
  constructor(private readonly _repo: ICardRepository) {}

  async bulkCreate(deckId: string, cards: CardResponseDto[]) {
    throw new NotImplementedException();
  }
  async findByDeck(deckId: string, userId: string) {
    throw new NotImplementedException();
  }
  async findById(id: string, userId: string) {
    throw new NotImplementedException();
  }
}
