import { DeckStatusesEnum } from '@/common/enums';
import { DeckEntity, DeckInsert } from '@/modules/database/schemas';
import { UpdateDeckDto } from './dto/update-deck.dto';

export abstract class IDeckRepository {
  abstract create(deckInsert: DeckInsert): Promise<DeckEntity>;
  abstract findAllByUser(userId: string): Promise<DeckEntity[]>;
  abstract findById(id: string, userId: string): Promise<DeckEntity>;
  abstract update(
    id: string,
    userId: string,
    dto: UpdateDeckDto,
  ): Promise<DeckEntity>;
  abstract updateStatus(
    id: string,
    status: DeckStatusesEnum,
  ): Promise<DeckEntity>;
  abstract delete(id: string, userId: string);
}
