import { PlanType } from '@/common/enums';
import { UserEntity } from '@/modules/database/schemas';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface IUserRepository {
  findById(userId: string): Promise<UserEntity | null>;
  updatePlan(userId: string, plan: PlanType);
  incrementUploads(userId: string);
  canUpload(userId: string): Promise<boolean>;
}
