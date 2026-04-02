import { Module } from '@nestjs/common';
import { UserService } from './application/user.service';

import { DatabaseModule } from '@/modules/database/database.module';

import { USER_REPOSITORY } from './domain/user.repository.interface';
import { DrizzleUserRepository } from './infrastructure/drizzle-user.repository';
import { UserController } from './presentation/user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
