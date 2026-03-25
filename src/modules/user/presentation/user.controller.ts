import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from '../application/user.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('me')
  async getMe() {}

  @AllowAnonymous()
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const user = await this._userService.findById(id);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.SERVICE_UNAVAILABLE);
      }
      throw new HttpException('Server error', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
