// modules/deck/deck.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  forwardRef,
  Inject,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { DeckService } from '../application/deck.service';
import { CardService } from '@/modules/card/application/card.service';

import { DeckResponseDto } from '../domain/dto/deck-response.dto';
import { UploadDeckDto } from '../domain/dto/upload-deck.dto';
import { UpdateDeckDto } from '../domain/dto/update-deck.dto';

import { CardResponseDto } from '@/modules/card/domain/dto/card-response.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('decks')
export class DeckController {
  constructor(
    private readonly _deckService: DeckService,
    @Inject(forwardRef(() => CardService))
    private readonly _cardService: CardService,
  ) {}

  private readonly logger = new Logger(DeckController.name);

  @Get()
  async getAll(@Req() req): Promise<DeckResponseDto[]> {
    const userId = req.user.id;
    this.logger.log(`[DECK CONTROLLER] GET | userId=${userId}`);
    return this._deckService.findAllByUser(userId);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<DeckResponseDto> {
    const userId = req.user.id;
    this.logger.log(
      `[DECK CONTROLLER] GET/:id | userId=${userId} | deckId=${id}`,
    );
    return this._deckService.findById(id, userId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          cb(new BadRequestException('Only PDF files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadDeck(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDeckDto,
    @Req() req,
  ): Promise<DeckResponseDto> {
    this.logger.log(`[DECK CONTROLLER] POST/upload`);
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userId = req.user.id;

    this.logger.log(
      `[DECK CONTROLLER] POST/upload | Calling intiateUpload service method`,
    );
    return this._deckService.initiateUpload(userId, file, dto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeckDto,
    @Req() req,
  ): Promise<DeckResponseDto> {
    const userId = req.user.id;
    this.logger.log(`[DECK CONTROLLER] PATCH/:id | userId=${userId}`);
    return this._deckService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<void> {
    const userId = req.user.id;
    this.logger.log(`[DECK CONTROLLER] DELETE/:id | userId=${userId}`);
    await this._deckService.delete(id, userId);
  }

  @Get(':id/cards')
  async getCards(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req,
  ): Promise<CardResponseDto[]> {
    const userId = req.user.id;
    this.logger.log(`[DECK CONTROLLER] GET/:id/cards | userId=${userId}`);
    return this._cardService.findByDeck(id, userId); // ⭐ Get deck's cards
  }
}
