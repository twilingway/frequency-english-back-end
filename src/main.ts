import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { getBotToken } from 'nestjs-telegraf';
// import { config } from 'dotenv';
// config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(3030);
}
bootstrap();
