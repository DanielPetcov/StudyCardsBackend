import { Injectable } from '@nestjs/common';

import { DeckStatusesEnum } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IDeckRepository } from '@/modules/deck/domain/deck.repository.interface';
import { deck } from '@/modules/database/schemas';
import { eq } from 'drizzle-orm';

import { DeckEntity } from '@/modules/database/schemas';
import { DeckResponseDto } from '../../domain/dto/deck-response.dto';
import { UpdateDeckDto } from '../../domain/dto/update-deck.dto';

@Injectable()
export class DrizzleDeckRepository implements IDeckRepository {
  constructor(private readonly _db: DatabaseService) {}

  create(userId: string, dto: any) {
    throw new Error('Method not implemented.');
  }
  async findAllByUser(userId: string) {
    const rows: DeckEntity[] = await this._db.db
      .select()
      .from(deck)
      .where(eq(deck.userId, userId));
    return rows;
  }
  findById(id: string, userId: string) {
    throw new Error('Method not implemented.');
  }

  update(id: string, userId: string, dto: UpdateDeckDto): Promise<DeckEntity> {}

  updateStatus(id: string, status: DeckStatusesEnum) {
    throw new Error('Method not implemented.');
  }
  delete(id: string, userId: string) {
    throw new Error('Method not implemented.');
  }
}
