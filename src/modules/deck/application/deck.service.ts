import {
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  DECK_REPOSITORY,
  type IDeckRepository,
} from '@/modules/deck/domain/deck.repository.interface';

import { DeckResponseDto } from '@/modules/deck/domain/dto/deck-response.dto';
import { UpdateDeckDto } from '@/modules/deck/domain/dto/update-deck.dto';
import { DeckStatuseType } from '@/common/enums';
import { UploadDeckDto } from '../domain/dto/upload-deck.dto';
import { QueueService } from '@/modules/queue/application/queue.service';
import { FileService } from '@/modules/file/application/file.service';
import { UserService } from '@/modules/user/application/user.service';

@Injectable()
export class DeckService {
  private readonly logger = new Logger(DeckService.name);

  constructor(
    @Inject(DECK_REPOSITORY)
    private readonly _repo: IDeckRepository,
    private readonly _file: FileService,
    @Inject(forwardRef(() => QueueService))
    private readonly _queue: QueueService,
    private readonly _user: UserService,
  ) {}

  async initiateUpload(
    userId: string,
    file: Express.Multer.File,
    dto: UploadDeckDto,
  ): Promise<DeckResponseDto> {
    this.logger.log(
      `Initiate upload started | userId=${userId} fileName=${file.originalname}`,
    );

    try {
      const canUpload = await this._user.canUpload(userId);
      if (!canUpload) {
        throw new HttpException('User can not upload', HttpStatus.BAD_GATEWAY);
      }

      const { plan } = await this._user.me(userId);

      this.logger.log(
        `Uploading file | userId=${userId} fileName=${file.originalname}`,
      );

      const { fileId, fileKey } = await this._file.uploadFile(
        file.buffer,
        file.originalname,
        userId,
        false,
      );

      this.logger.log(`File uploaded | fileId=${fileId} fileKey=${fileKey}`);

      this.logger.log(`Incrementing filesUploaded for user | userId=${userId}`);
      await this._user.incrementUploads(userId);

      const deck = await this._repo.create({
        title: file.originalname.replace(/\.pdf$/i, ''),
        description: 'Processing...',
        fileId,
        language: dto.language || 'en',
        icon: 'clock',
        status: 'processing',
        cardCount: 0,
        cardsStudied: 0,
        starred: false,
        archived: false,
        userId: userId,
      });

      this.logger.log(`Deck created | deckId=${deck.id} status=processing`);

      await this._queue.addDeckProcessingJob({
        deckId: deck.id,
        userId,
        userPlan: plan,
        fileId,
        fileKey,
        language: dto.language || 'en',
      });

      this.logger.log(
        `Processing job queued | deckId=${deck.id} fileKey=${fileKey}`,
      );

      const response = await this.toResponseDto(deck);

      this.logger.log(`Initiate upload completed | deckId=${deck.id}`);

      return response;
    } catch (error) {
      this.logger.error(
        `Initiate upload failed | userId=${userId} fileName=${file.originalname}`,
        error.stack,
      );
      throw new HttpException('Initial Upload Failed', HttpStatus.BAD_REQUEST);
    }
  }

  private async toResponseDto(deck: any): Promise<DeckResponseDto> {
    this.logger.log(`Build deck response | deckId=${deck.id}`);

    try {
      const pdfUrl = deck.fileId
        ? await this._file.getSignedUrl(deck.fileId)
        : '';

      this.logger.log(`Deck response built | deckId=${deck.id}`);

      return {
        id: deck.id,
        title: deck.title,
        description: deck.description,
        pdfUrl,
        fileId: deck.fileId,
        cardCount: deck.cardCount,
        cardsStudied: deck.cardsStudied,
        language: deck.language,
        status: deck.status,
        icon: deck.icon,
        starred: deck.starred,
        archived: deck.archived,
        archivedAt: deck.archivedAt,
        lastAccessedAt: deck.lastAccessedAt,
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
      };
    } catch (error) {
      this.logger.error(
        `Failed to build deck response | deckId=${deck.id}`,
        error.stack,
      );
      throw new HttpException(
        'Failed to get the pdfUrl',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllByUser(userId: string): Promise<DeckResponseDto[]> {
    this.logger.log(`Find all decks started | userId=${userId}`);

    const decks = await this._repo.findAllByUser(userId);

    this.logger.log(`Decks fetched | userId=${userId} count=${decks.length}`);

    return Promise.all(decks.map((d) => this.toResponseDto(d)));
  }

  async findById(id: string, userId: string): Promise<DeckResponseDto> {
    this.logger.log(`Find deck by id started | deckId=${id} userId=${userId}`);

    const deck = await this._repo.findById(id, userId);

    if (!deck) {
      this.logger.warn(`Deck not found | deckId=${id} userId=${userId}`);
      throw new NotFoundException(`Deck with id ${id} not found`);
    }

    if (deck.userId !== userId) {
      this.logger.warn(`Access denied to deck | deckId=${id} userId=${userId}`);
      throw new ForbiddenException(`Access denied`);
    }

    this.logger.log(`Find deck by id completed | deckId=${id}`);

    return await this.toResponseDto(deck);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDeckDto,
  ): Promise<DeckResponseDto> {
    this.logger.log(`Update deck started | deckId=${id} userId=${userId}`);

    await this.findById(id, userId);

    const updated = await this._repo.update(id, userId, dto);

    this.logger.log(`Deck updated | deckId=${id}`);

    return await this.toResponseDto(updated);
  }

  async updateStatus(id: string, status: DeckStatuseType): Promise<void> {
    this.logger.log(`Update deck status | deckId=${id} status=${status}`);

    await this._repo.updateStatus(id, status);
  }

  async delete(id: string, userId: string): Promise<void> {
    this.logger.log(`Delete deck started | deckId=${id} userId=${userId}`);

    await this.findById(id, userId);

    await this._repo.delete(id, userId);

    this.logger.log(`Delete deck completed | deckId=${id}`);
  }
}
