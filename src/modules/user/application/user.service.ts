import { Injectable } from '@nestjs/common';

import { PlansEnum } from '@/common/enums';
import { IUserRepository } from '@/modules/user/domain/user.repository.interface';

@Injectable()
export class UserService {
  constructor(private readonly _repo: IUserRepository) {}

  async findById(id: string) {}
  async updatePlan(id: string, plan: PlansEnum) {}
  async incrementUploads(id: string) {}
  async canUpload(id: string): Promise<boolean> {
    return true;
  }
}
