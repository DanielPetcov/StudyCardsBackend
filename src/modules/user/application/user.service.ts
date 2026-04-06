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

  async updatePlan(userId: string, plan: PlanType) {
    try {
      await this.checkUserExists(userId);

      this.logger.log(
        `Updating the user plan | userId=${userId} | plan=${plan}`,
      );
      const user = await this._repo.updatePlan(userId, plan);
      if (!user) {
        throw new Error('User returned null');
      }

      return user;
    } catch (error) {
      this.logger.error(`Failed to update user plan | userId=${userId}`);
      throw new HttpException(
        'Failed to update user plan',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  async incrementUploads(userId: string) {
    try {
      await this.checkUserExists(userId);

      this.logger.log(`Incrementing user uploads | userId=${userId}`);
      const user = await this._repo.incrementUploads(userId);
      if (!user) {
        throw new Error('User returned null');
      }

      return user;
    } catch (error) {
      this.logger.error(`Failed to increment user uploads | userId=${userId}`);
      throw new HttpException(
        'Failed to increment user uploads',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async updatePolarCustomerId(userId: string, polarCustomerId: string) {
    try {
      this.logger.log(
        `Trying to update user polarCustomerId | userId=${userId} | polarCustomerId=${polarCustomerId}`,
      );
      await this._repo.updateCustomerId(userId, polarCustomerId);
    } catch (error) {
      this.logger.error(
        `Failed to update user polarCustomerId | userId=${userId} | polarCustomerId=${polarCustomerId}`,
      );
      throw new HttpException(
        'Failed to update user polarCustomerId',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  private async toResponseDto(user: UserEntity): Promise<UserResponseDto> {
    const userInfo = await this._repo.getUserQuotaInfo(user.id);
    return {
      name: user.name,
      email: user.email,
      language: user.language,
      plan: user.plan,
      uploadsUsed: user.uploadsUsed,
      activeDecks: userInfo?.activeDecks ?? 0,
    };
  }

  private async checkUserExists(userId: string): Promise<boolean> {
    this.logger.log(`Find user started | userId=${userId}`);
    const user = await this._repo.findById(userId);

    if (!user) {
      this.logger.log(`User not found | userId=${userId}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
