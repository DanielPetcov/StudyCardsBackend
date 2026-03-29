import { PlanType } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IUserRepository } from '@/modules/user/domain/user.repository.interface';
import { user } from '@/modules/database/schemas';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly _db: DatabaseService) {}

  async findById(id: string) {
    try {
      const rows = await this._db.db
        .select()
        .from(user)
        .where(eq(user.id, id))
        .limit(1);

      return rows[0] ?? null;
    } catch (error) {
      console.error('findById error:', error);
      console.error('cause:', error instanceof Error ? error.cause : undefined);
      throw error;
    }
  }
  updatePlan(id: string, plan: PlanType) {
    throw new Error('Method not implemented.');
  }
  incrementUploads(id: string) {
    throw new Error('Method not implemented.');
  }
  canUpload(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
