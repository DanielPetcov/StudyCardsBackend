import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('app')
export class AppController {
  @AllowAnonymous()
  @Get()
  testfunction() {
    return JSON.stringify({ message: 'hello world' });
  }
}
