import { Injectable } from '@nestjs/common';

import { DeckStatuseType } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IDeckRepository } from '@/modules/deck/domain/deck.repository.interface';
import { deck, DeckInsert } from '@/modules/database/schemas';
import { and, eq } from 'drizzle-orm';

import { DeckEntity } from '@/modules/database/schemas';
import { UpdateDeckDto } from '../../domain/dto/update-deck.dto';

@Injectable()
export class DrizzleDeckRepository implements IDeckRepository {
  constructor(private readonly _db: DatabaseService) {}

  async create(deckInsert: DeckInsert): Promise<DeckEntity> {
    const [newDeck] = await this._db.db
      .insert(deck)
      .values(deckInsert)
      .returning();
    return newDeck;
  }

  async findAllByUser(userId: string) {
    const rows: DeckEntity[] = await this._db.db
      .select()
      .from(deck)
      .where(eq(deck.userId, userId));
    return rows;
  }

  async findById(id: string, userId: string): Promise<DeckEntity | null> {
    const [result] = await this._db.db
      .select()
      .from(deck)
      .where(and(eq(deck.id, id), eq(deck.userId, userId)));
    return result || null;
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateDeckDto,
  ): Promise<DeckEntity | null> {
    const [result] = await this._db.db
      .update(deck)
      .set({
        ...dto,
      })
      .where(and(eq(deck.id, id), eq(deck.userId, userId)))
      .returning();

    return result || null;
  }

  async updateStatus(id: string, status: DeckStatuseType): Promise<DeckEntity> {
    const [result] = await this._db.db
      .update(deck)
      .set({
        status: status,
      })
      .where(eq(deck.id, id))
      .returning();

    return result || null;
  }

  async delete(id: string, userId: string): Promise<DeckEntity> {
    const [result] = await this._db.db
      .delete(deck)
      .where(and(eq(deck.id, id), eq(deck.userId, userId)))
      .returning();
    return result || null;
  }
}
