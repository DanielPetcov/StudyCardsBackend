import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';

import { DeckService } from '@/modules/deck/application/deck.service';
import { DeckResponseDto } from '@/modules/deck/domain/dto/deck-response.dto';
import { CreateDeckDto } from '@/modules/deck/domain/dto/deck-create.dto';
import { UpdateDeckDto } from '@/modules/deck/domain/dto/update-deck.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDeckDto } from '../domain/dto/upload-deck.dto';

const allowedTypes = new Set<string>(['application/pdf']);

@Controller('decks')
@UseGuards(AuthGuard)
export class DeckController {
  constructor(private readonly _service: DeckService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!allowedTypes.has(file.mimetype)) {
          cb(new BadRequestException('This file type is not allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadDeck(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDeckDto,
    @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const userId = this.extractUserId(req);

    return this._service.initialUpload(userId, file, dto);
  }

  private extractUserId(req: any): string {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return userId;
  }
}

// function temporary() {
//   @Get()
//   async getAll(@Req() req): Promise<DeckResponseDto[]> {
//     const userId = this.extractUserId(req);
//     return this._service.findAllByUser(userId);
//   }

//   @Get(':id')
//   async getById(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Req() req,
//   ): Promise<DeckResponseDto> {
//     const userId = this.extractUserId(req);
//     return this._service.findById(id, userId);
//   }

//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   async create(
//     @Body() dto: CreateDeckDto,
//     @Req() req,
//   ): Promise<DeckResponseDto> {
//     const userId = this.extractUserId(req);
//     return this._service.create(userId, dto);
//   }

//   @Patch(':id')
//   async update(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() dto: UpdateDeckDto,
//     @Req() req,
//   ): Promise<DeckResponseDto> {
//     const userId = this.extractUserId(req);
//     return this._service.update(id, userId, dto);
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   async delete(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Req() req,
//   ): Promise<void> {
//     const userId = this.extractUserId(req);
//     await this._service.delete(id, userId);
//   }

//   @Get(':id/cards')
//   async getCards(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
//     const userId = this.extractUserId(req);
//     // TODO: implement card fetching
//     return [];
//   }
// }
