import { PlanType, LanguageType } from '@/common/enums';

export class UserResponseDto {
  name: string;
  email: string;
  language: LanguageType;
  uploadsUsed: number;
  plan: PlanType;
}
