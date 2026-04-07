import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { setAppContext } from './app-context';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  app.enableCors({
    origin: ['http://localhost:3000', 'https://study-cards-amber.vercel.app'],
    credentials: true,

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  setAppContext(app);
  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}
bootstrap();
