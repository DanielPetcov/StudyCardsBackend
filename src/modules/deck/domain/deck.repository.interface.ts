import { DeckEntity } from './deck.entity';
import { CreateDeckDto } from './dto/createDeckDto';

export abstract class IDeckRepository {
  abstract getAll(userId: string): Promise<DeckEntity[]>;
  abstract create(dto: CreateDeckDto): Promise<DeckEntity>;
}
