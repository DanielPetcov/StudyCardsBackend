import { PlanType } from '@/common/enums';
import { UserEntity } from '@/modules/database/schemas';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface IUserRepository {
  findById(userId: string): Promise<UserEntity | null>;
  getUserQuotaInfo(userId: string): Promise<UserQuotaData | null>;
  updatePlan(userId: string, plan: PlanType): Promise<void>;
  incrementUploads(userId: string): Promise<void>;
}

export interface UserQuotaData {
  uploadsUsed: number;
  plan: PlanType;
  activeDecks: number;
}
