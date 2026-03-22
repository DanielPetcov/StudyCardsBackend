import { Injectable } from '@nestjs/common';
import { IDeckRepository } from '../../domain/deck.repository.interface';
import { DatabaseService } from 'src/modules/database/database.service';

@Injectable()
export class DrizzleDeckRepository implements IDeckRepository {
  constructor(private readonly _db: DatabaseService) {}

  create() {
    throw new Error('Method not implemented.');
  }
}
