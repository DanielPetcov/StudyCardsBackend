import { PlanType } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IUserRepository } from '@/modules/user/domain/user.repository.interface';
import { deck, user } from '@/modules/database/schemas';
import { and, eq, or, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly _db: DatabaseService) {}
  updatePlan(userId: string, plan: PlanType): Promise<void> {
    throw new Error('Method not implemented.');
  }
  incrementUploads(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(userId: string) {
    const [row] = await this._db.db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return row ?? null;
  }

  async getUserQuotaInfo(userId: string) {
    const [result] = await this._db.db
      .select({
        uploadsUsed: user.uploadsUsed,
        plan: user.plan,
        activeDecks: sql<number>`count(${deck.id})`.as('activeDecks'),
      })
      .from(user)
      .leftJoin(
        deck,
        and(
          eq(user.id, deck.userId),
          or(eq(deck.status, 'processing'), eq(deck.status, 'ready')),
        ),
      )
      .where(eq(user.id, userId))
      .groupBy(user.id)
      .limit(1);

    return result ?? null;
  }
}
