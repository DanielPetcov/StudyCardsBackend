import { PlanType } from '@/common/enums';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface IUserRepository {
  findById(id: string);
  updatePlan(id: string, plan: PlanType);
  incrementUploads(id: string);
  canUpload(id: string): Promise<boolean>;
}
