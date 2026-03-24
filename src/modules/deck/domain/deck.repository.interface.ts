import { DeckStatusesEnum } from '@/common/enums';

export abstract class IDeckRepository {
  abstract create(userId: string, dto);
  abstract findAllByUser(userId: string);
  abstract findById(id: string, userId: string);
  abstract updateStatus(id: string, status: DeckStatusesEnum);
  abstract delete(id: string, userId: string);
}
