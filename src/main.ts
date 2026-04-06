import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { setAppContext } from './app-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  setAppContext(app);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
