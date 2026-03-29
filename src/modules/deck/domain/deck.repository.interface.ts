import { DeckStatuseType } from '@/common/enums';
import { DeckEntity, DeckInsert } from '@/modules/database/schemas';
import { UpdateDeckDto } from './dto/update-deck.dto';

export const DECK_REPOSITORY = Symbol('DECK_REPOSITORY');
export interface IDeckRepository {
  create(deckInsert: DeckInsert): Promise<DeckEntity>;
  findAllByUser(userId: string): Promise<DeckEntity[]>;
  findById(id: string, userId: string): Promise<DeckEntity | null>;
  update(
    id: string,
    userId: string,
    dto: UpdateDeckDto,
  ): Promise<DeckEntity | null>;
  updateStatus(id: string, status: DeckStatuseType): Promise<DeckEntity | null>;
  delete(id: string, userId: string): Promise<DeckEntity | null>;
}
