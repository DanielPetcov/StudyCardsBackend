import { Injectable } from '@nestjs/common';

import { DeckStatusesEnum } from '@/common/enums';
import { IDeckRepository } from '@/modules/deck/domain/deck.repository.interface';
import { CreateDeckDto } from '@/modules/deck/domain/dto/createDeckDto';

@Injectable()
export class DeckService {
  constructor(private readonly _repo: IDeckRepository) {}

  async create(userId: string, dto: CreateDeckDto) {}
  async findAllByUser(userId: string) {}
  async findById(id: string, userId: string) {}
  async updateStatus(id: string, status: DeckStatusesEnum) {}
  async delete(id: string, userId: string) {}
}
