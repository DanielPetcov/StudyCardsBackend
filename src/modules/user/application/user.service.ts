import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { PlanType } from '@/common/enums';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '@/modules/user/domain/user.repository.interface';
import { UserEntity } from '@/modules/database/schemas';
import { UserResponseDto } from '../domain/dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly _repo: IUserRepository,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async me(userId: string) {
    try {
      this.logger.log(`Find user started | userId=${userId}`);
      const user = await this._repo.findById(userId);

      if (!user) {
        this.logger.log(`User not found | userId=${userId}`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return this.toResponseDto(user);
    } catch (error) {
      this.logger.error(
        `Failed to get resources about user | userId=${userId}`,
      );
      throw new HttpException(
        'Failed to get information about user',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async updatePlan(id: string, plan: PlanType) {}
  async incrementUploads(id: string) {}
  async canUpload(id: string): Promise<boolean> {
    return true;
  }

  private toResponseDto(user: UserEntity): UserResponseDto {
    return {
      name: user.name,
      email: user.email,
      language: user.language,
      plan: user.plan,
      uploadsUsed: user.uploadsUsed,
    };
  }
}
