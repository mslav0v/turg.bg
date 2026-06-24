import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    
    if (!redisUrl) {
      throw new Error('REDIS_URL липсва в .env файла!');
    }

    // Свързване с Upstash Redis
    this.redisClient = new Redis(redisUrl, {
      tls: {
        rejectUnauthorized: false, // Изисква се за Serverless Redis
      },
    });

    this.redisClient.on('connect', () => {
      this.logger.log('✅ Успешна връзка с Upstash Redis!');
    });

    this.redisClient.on('error', (err) => {
      this.logger.error('❌ Грешка при връзка с Redis', err);
    });
  }

  onModuleDestroy() {
    this.redisClient.quit();
  }

  // Метод за взимане на инстанцията (ще ни трябва за заключванията)
  getClient(): Redis {
    return this.redisClient;
  }
}