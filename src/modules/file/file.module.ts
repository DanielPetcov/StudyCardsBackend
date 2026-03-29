import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { FileService } from './application/file.service';
import { FILE_REPOSITORY } from './domain/file.repository.interface';
import { DrizzleFileRepository } from './infrastructure/drizzle/drizzle-file.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [
    FileService,
    {
      provide: FILE_REPOSITORY,
      useClass: DrizzleFileRepository,
    },
  ],
  exports: [FileService],
})
export class FileModule {}
