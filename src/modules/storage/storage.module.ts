import { Module } from '@nestjs/common';
import { StorageService } from './application/storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
