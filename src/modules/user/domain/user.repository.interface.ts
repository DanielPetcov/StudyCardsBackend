import { PlansEnum } from '@/common/enums';

export abstract class IUserRepository {
  abstract findById(id: string);
  abstract updatePlan(id: string, plan: PlansEnum);
  abstract incrementUploads(id: string);
  abstract canUpload(id: string): Promise<boolean>;
}
