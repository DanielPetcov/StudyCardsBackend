import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';

import {
  CARD_REPOSITORY,
  type ICardRepository,
} from '../domain/card.repository.interface';
import {
  DECK_REPOSITORY,
  type IDeckRepository,
} from '@/modules/deck/domain/deck.repository.interface';

import { CreateCardDto } from '../domain/dto/create-card.dto';
import { CardResponseDto } from '../domain/dto/card-response.dto';

@Injectable()
export class CardService {
  private readonly logger = new Logger(CardService.name);

  constructor(
    @Inject(CARD_REPOSITORY)
    private readonly _repo: ICardRepository,
    @Inject(forwardRef(() => DECK_REPOSITORY))
    private readonly _deckRepo: IDeckRepository,
  ) {}

  /**
   * Bulk create cards for a deck (used by AI processing)
   */
  async bulkCreate(deckId: string, cards: CreateCardDto[]): Promise<void> {
    this.logger.log(
      `Bulk create cards started | deckId=${deckId} totalCards=${cards?.length ?? 0}`,
    );

    if (!cards || cards.length === 0) {
      this.logger.warn(`No cards provided | deckId=${deckId}`);
      throw new Error('No cards provided for bulk creation');
    }

    const validCards = cards.filter(
      (card) => card.question?.trim() && card.explanation?.trim(),
    );

    if (validCards.length === 0) {
      this.logger.warn(`No valid cards after filtering | deckId=${deckId}`);
      throw new Error('No valid cards to create');
    }

    await this._repo.bulkCreate(deckId, validCards);

    this.logger.log(
      `Bulk create cards completed | deckId=${deckId} inserted=${validCards.length}`,
    );
  }

  /**
   * Get all cards for a deck (with ownership verification)
   */
  async findByDeck(deckId: string, userId: string): Promise<CardResponseDto[]> {
    this.logger.log(
      `Find cards by deck started | deckId=${deckId} userId=${userId}`,
    );

    const deck = await this._deckRepo.findById(deckId, userId);

    if (!deck) {
      this.logger.warn(`Deck not found | deckId=${deckId} userId=${userId}`);
      throw new NotFoundException(`Deck with id ${deckId} not found`);
    }

    if (deck.userId !== userId) {
      this.logger.warn(
        `Access denied to deck | deckId=${deckId} userId=${userId}`,
      );
      throw new ForbiddenException('Access denied');
    }

    const cards = await this._repo.findByDeck(deckId);

    this.logger.log(
      `Find cards by deck completed | deckId=${deckId} count=${cards.length}`,
    );

    return cards.map((card) => this.toResponseDto(card));
  }

  /**
   * Get single card by ID (with ownership verification)
   */
  async findById(id: string, userId: string): Promise<CardResponseDto> {
    this.logger.log(`Find card by id started | cardId=${id} userId=${userId}`);

    const card = await this._repo.findById(id);

    if (!card) {
      this.logger.warn(`Card not found | cardId=${id}`);
      throw new NotFoundException(`Card with id ${id} not found`);
    }

    const deck = await this._deckRepo.findById(card.deckId, userId);

    if (!deck) {
      this.logger.warn(
        `Deck not found for card | cardId=${id} deckId=${card.deckId}`,
      );
      throw new NotFoundException(`Deck not found`);
    }

    if (deck.userId !== userId) {
      this.logger.warn(`Access denied to card | cardId=${id} userId=${userId}`);
      throw new ForbiddenException('Access denied');
    }

    this.logger.log(`Find card by id completed | cardId=${id}`);

    return this.toResponseDto(card);
  }

  /**
   * Delete a card (with ownership verification)
   */
  async delete(id: string, userId: string): Promise<void> {
    this.logger.log(`Delete card started | cardId=${id} userId=${userId}`);

    await this.findById(id, userId);

    await this._repo.delete(id);

    this.logger.log(`Delete card completed | cardId=${id}`);
  }

  private toResponseDto(card: any): CardResponseDto {
    return {
      id: card.id,
      deckId: card.deckId,
      question: card.question,
      explanation: card.explanation,
      difficulty: card.difficulty,
      order: card.order,
    };
  }
}
