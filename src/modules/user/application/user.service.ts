import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { PlanType } from '@/common/enums';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '@/modules/user/domain/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _repo: IUserRepository,
  ) {}

  async findById(id: string) {
    const user = await this._repo.findById(id);

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
  async updatePlan(id: string, plan: PlanType) {}
  async incrementUploads(id: string) {}
  async canUpload(id: string): Promise<boolean> {
    return true;
  }
}
