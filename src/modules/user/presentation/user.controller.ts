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
    return this._userService.me(userId);
  }
}
