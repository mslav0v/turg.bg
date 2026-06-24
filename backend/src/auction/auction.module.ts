import { Module } from '@nestjs/common';
import { AuctionGateway } from './auction.gateway';
import { RedisService } from './redis.service';
import { PrismaService } from '../prisma.service';
import { AuctionScheduler } from './auction.scheduler';
import { AuctionController } from './auction.controller'; // НОВО

@Module({
  controllers: [AuctionController], // НОВО
  providers: [AuctionGateway, RedisService, PrismaService, AuctionScheduler],
})
export class AuctionModule {}