import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/modules/database/database.service';

import { DeckEntity } from '@_modules/deck/domain/deck.entity';
import { CreateDeckDto } from '@_modules/deck/domain/dto/createDeckDto';

import { IDeckRepository } from '@_modules/deck/domain/deck.repository.interface';

@Injectable()
export class DrizzleDeckRepository implements IDeckRepository {
  constructor(private readonly _db: DatabaseService) {}
  getAll(userId: string): Promise<DeckEntity[]> {
    throw new Error('Method not implemented.');
  }

  create(dto: CreateDeckDto): Promise<DeckEntity> {
    throw new Error('Method not implemented.');
  }
}
