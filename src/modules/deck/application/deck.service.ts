import { Injectable } from '@nestjs/common';
import { IDeckRepository } from '../domain/deck.repository.interface';

@Injectable()
export class DeckService {
  constructor(private readonly _repo: IDeckRepository) {}
}
