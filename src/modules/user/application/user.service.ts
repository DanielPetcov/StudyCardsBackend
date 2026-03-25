import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PlansEnum } from '@/common/enums';
import { IUserRepository } from '@/modules/user/domain/user.repository.interface';

@Injectable()
export class UserService {
  constructor(private readonly _repo: IUserRepository) {}

  async findById(id: string) {
    const user = await this._repo.findById(id);

    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
  async updatePlan(id: string, plan: PlansEnum) {}
  async incrementUploads(id: string) {}
  async canUpload(id: string): Promise<boolean> {
    return true;
  }
}
