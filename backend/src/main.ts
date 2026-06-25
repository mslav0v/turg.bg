import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Активираме CORS (позволява на turg.bg и локалния фронтенд да четат данни свободно)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://turg.bg',
      'https://www.turg.bg',
      'https://turg-bg.vercel.app' // Добавяме и временния Vercel адрес за застраховка
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Взимаме порта от .env или ползваме 4000 като резерва
  const port = process.env.PORT || 4000;
  
  await app.listen(port);
  console.log(`🚀 Бекендът е стартиран успешно и слуша на порт: ${port}`);
}
bootstrap();