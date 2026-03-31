import { PlanType } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IUserRepository } from '@/modules/user/domain/user.repository.interface';
import { user } from '@/modules/database/schemas';
import { eq } from 'drizzle-orm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly _db: DatabaseService) {}

  async findById(userId: string) {
    const [row] = await this._db.db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return row ?? null;
  }
  updatePlan(userId: string, plan: PlanType) {
    throw new Error('Method not implemented.');
  }
  incrementUploads(userId: string) {
    throw new Error('Method not implemented.');
  }
  canUpload(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
