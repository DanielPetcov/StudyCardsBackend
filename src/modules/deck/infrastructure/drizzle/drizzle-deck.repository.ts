import { Injectable } from '@nestjs/common';

import { DeckStatusesEnum } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IDeckRepository } from '@/modules/deck/domain/deck.repository.interface';

@Injectable()
export class DrizzleDeckRepository implements IDeckRepository {
  constructor(private readonly _db: DatabaseService) {}

  create(userId: string, dto: any) {
    throw new Error('Method not implemented.');
  }
  findAllByUser(userId: string) {
    throw new Error('Method not implemented.');
  }
  findById(id: string, userId: string) {
    throw new Error('Method not implemented.');
  }
  updateStatus(id: string, status: DeckStatusesEnum) {
    throw new Error('Method not implemented.');
  }
  delete(id: string, userId: string) {
    throw new Error('Method not implemented.');
  }
}
