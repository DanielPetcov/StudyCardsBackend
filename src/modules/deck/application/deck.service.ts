import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

import { IDeckRepository } from '@/modules/deck/domain/deck.repository.interface';

import { DeckMapper } from '@/modules/deck/domain/deck.mapper';
import { DeckResponseDto } from '@/modules/deck/domain/dto/deck-response.dto';
import { CreateDeckDto } from '@/modules/deck/domain/dto/deck-create.dto';
import { UpdateDeckDto } from '@/modules/deck/domain/dto/update-deck.dto';
import { DeckStatusesEnum, LanguagesEnum } from '@/common/enums';
import { UploadDeckDto } from '../domain/dto/upload-deck.dto';
import { StorageService } from '@/modules/storage/application/storage.service';
import { AiService } from '@/modules/ai/application/ai.service';
import { CardService } from '@/modules/card/application/card.service';
import { QueueService } from '@/modules/queue/application/queue.service';

@Injectable()
export class DeckService {
  constructor(
    private readonly _repo: IDeckRepository,
    private readonly _storage: StorageService,
    private readonly _ai: AiService,
    private readonly _card: CardService,
    private readonly _queue: QueueService,
  ) {}

  async initialUpload(
    userId: string,
    file: Express.Multer.File,
    dto: UploadDeckDto,
  ): Promise<DeckResponseDto> {
    const deck = await this._repo.create({
      title: file.originalname.replace(/\.pdf$/i, ''),
      description: 'Processing...',
      language: dto.language || 'en',
      icon: 'clock',
      status: 'processing',
      cardCount: 0,
      cardsStudied: 0,
      starred: false,
      archived: false,
      userId: userId,
    });

    await this._queue.addDeckProcessingJob({
      deckId: deck.id,
      userId,
      file: {
        buffer: file.buffer,
        originalname: file.originalname,
        mimetype: file.mimetype,
      },
      language: dto.language || 'en',
    });

    return DeckMapper.ToResponseDto(deck);
  }

  async processDeck(jobData: {
    deckId: string;
    userId: string;
    file: { buffer: Buffer; originalname: string; mimetype: string };
    language: string;
  }): Promise<void> {
    try {
      const pdfUrl = await this._storage.uploadPdf(
        jobData.file.buffer,
        jobData.file.originalname,
        jobData.userId,
      );

      const aiAnalysis = await this._ai.analyzeDeck(
        jobData.file.buffer,
        LanguagesEnum[jobData.language],
      );

      await this._repo.update(jobData.deckId, jobData.userId, {
        title: aiAnalysis.title,
        description: aiAnalysis.description,
        icon: aiAnalysis.icon,
        pdfUrl: pdfUrl,
        cardCount: aiAnalysis.cards.length,
        status: DeckStatusesEnum.READY,
      });

      await this._card.bulkCreate(jobData.deckId, aiAnalysis.cards);
    } catch (error) {
      await this._repo.updateStatus(jobData.deckId, DeckStatusesEnum.FAILED);
      throw error;
    }
  }

  async findAllByUser(userId: string): Promise<DeckResponseDto[]> {
    const decks = await this._repo.findAllByUser(userId);
    return decks.map((deck) => DeckMapper.ToResponseDto(deck));
  }

  async findById(id: string, userId: string): Promise<DeckResponseDto> {
    const deck = await this._repo.findById(id, userId);
    if (!deck) {
      throw new NotFoundException(`Deck with id ${id} not found`);
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException(`Access denied`);
    }

    return DeckMapper.ToResponseDto(deck);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDeckDto,
  ): Promise<DeckResponseDto> {
    // Verify ownership
    await this.findById(id, userId);

    const updated = await this._repo.update(id, userId, dto);
    return DeckMapper.ToResponseDto(updated);
  }

  async updateStatus(id: string, status: DeckStatusesEnum): Promise<void> {
    await this._repo.updateStatus(id, status);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.findById(id, userId);

    await this._repo.delete(id, userId);
  }
}
