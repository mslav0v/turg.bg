import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Активираме CORS (позволява на turg.bg фронтенда да чете данни свободно)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // 2. Взимаме порта от .env или ползваме 4000 като резерва
  const port = process.env.PORT || 4000;
  
  await app.listen(port);
  console.log(`🚀 Бекендът е стартиран успешно и слуша на: http://localhost:${port}`);
}
bootstrap();