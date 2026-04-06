import { PlanType } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IUserRepository } from '@/modules/user/domain/user.repository.interface';
import { deck, user, UserEntity } from '@/modules/database/schemas';
import { and, eq, or, sql } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly _db: DatabaseService) {}

  async updatePlan(userId: string, plan: PlanType): Promise<UserEntity | null> {
    const [row] = await this._db.db
      .update(user)
      .set({
        plan: plan,
      })
      .where(eq(user.id, userId))
      .returning();

    return row ?? null;
  }

  async incrementUploads(userId: string): Promise<UserEntity | null> {
    const [row] = await this._db.db
      .select({ uploadsUsed: user.uploadsUsed })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    const [updatedUser] = await this._db.db
      .update(user)
      .set({
        uploadsUsed: row.uploadsUsed + 1,
      })
      .where(eq(user.id, userId))
      .returning();

    return updatedUser ?? null;
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
        activeDecks: sql<number>`count(${deck.id})::int`.as('activeDecks'),
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

  async updateCustomerId(
    userId: string,
    polarCustomerId: string,
  ): Promise<null> {
    await this._db.db
      .update(user)
      .set({
        polarCustomerId: polarCustomerId,
      })
      .where(eq(user.id, userId));

    return null;
  }
}
