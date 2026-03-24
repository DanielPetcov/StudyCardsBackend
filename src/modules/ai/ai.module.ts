import { Module } from '@nestjs/common';
import { AiService } from './application/ai.service';

@Module({
  providers: [AiService],
})
export class AiModule {}
