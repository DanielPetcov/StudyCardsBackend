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

import { UserQuota } from '../domain/models/user-quota.model';

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

      this.logger.log(`Returning user`);
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

  async canUpload(userId: string): Promise<boolean> {
    try {
      const quotaData = await this._repo.getUserQuotaInfo(userId);
      if (!quotaData) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const quota = new UserQuota(
        quotaData.uploadsUsed,
        quotaData.plan,
        quotaData.activeDecks,
      );

      const { allowed, reason } = quota.canUpload();

      if (!allowed) {
        this.logger.log(`Upload denied | userId=${userId} reason=${reason}`);
        throw new HttpException(reason || '', HttpStatus.FORBIDDEN);
      }

      return true;
      return true;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(
        `Failed to check upload permissions | userId=${userId}`,
        error,
      );
      throw new HttpException(
        'Failed to check upload permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePlan(id: string, plan: PlanType) {}
  async incrementUploads(id: string) {}

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
