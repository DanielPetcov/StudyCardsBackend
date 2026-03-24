import { PlansEnum } from '@/common/enums';

import { DatabaseService } from '@/modules/database/database.service';
import { IUserRepository } from '@/modules/user/domain/user.repository.interface';

export class DrizzleUserRepository implements IUserRepository {
  constructor(private readonly _db: DatabaseService) {}

  findById(id: string) {
    throw new Error('Method not implemented.');
  }
  updatePlan(id: string, plan: PlansEnum) {
    throw new Error('Method not implemented.');
  }
  incrementUploads(id: string) {
    throw new Error('Method not implemented.');
  }
  canUpload(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
