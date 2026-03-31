import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Req,
} from '@nestjs/common';
import { UserService } from '../application/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}
  private readonly logger = new Logger(Controller.name);

  @Get('me')
  async getMe(@Req() req) {
    this.logger.log('[USER CONTROLLER] GET/me');
    const userId = await req.user.id;
    this.logger.log(
      `[USER CONTROLLER] GET/me | Calling me service method | userId=${userId}`,
    );
    return await this._userService.me(userId);
  }

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
