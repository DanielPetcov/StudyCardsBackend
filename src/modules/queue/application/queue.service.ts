import { LanguagesEnumType } from '@/common/enums';
import { Injectable, NotImplementedException } from '@nestjs/common';

interface AddDeckProcessingJobProps {
  deckId: string;
  userId: string;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
  language: LanguagesEnumType;
}

@Injectable()
export class QueueService {
  constructor() {}

  async addDeckProcessingJob({
    deckId,
    userId,
    file,
    language,
  }: AddDeckProcessingJobProps): Promise<void> {
    throw new NotImplementedException();
  }
}
