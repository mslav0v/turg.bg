import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuctionScheduler {
  private readonly logger = new Logger(AuctionScheduler.name);

  constructor(private prisma: PrismaService) {}

  // Изпълнява се на всеки 10 секунди
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleEndedAuctions() {
    const now = new Date();

    // 1. Търсим всички активни търгове, на които времето е изтекло
    const expiredAuctions = await this.prisma.auction.findMany({
      where: {
        status: 'ACTIVE',
        endTime: { lte: now },
      },
      include: {
        bids: {
          orderBy: { amount: 'desc' }, // Подреждаме бидовете от най-висок към най-нисък
          take: 1, // Взимаме само топ бита (Победителя)
        },
      },
    });

    for (const auction of expiredAuctions) {
      this.logger.log(`⏳ Обработка на изтекъл търг: ${auction.id}`);

      const highestBid = auction.bids[0];
      // Проверка: Достигната ли е Скритата минимална цена?
      const isReserveMet = Number(auction.currentPrice) >= Number(auction.reservePrice);

      if (highestBid && isReserveMet) {
        // --- СЦЕНАРИЙ А: УСПЕШЕН ТЪРГ ---
        await this.prisma.$transaction(async (prisma) => {
          // Затваряме търга като УСПЕШЕН
          await prisma.auction.update({
            where: { id: auction.id },
            data: { status: 'COMPLETED' },
          });

          // Удържаме (CAPTURED) депозита на победителя
          await prisma.deposit.updateMany({
            where: { auctionId: auction.id, userId: highestBid.userId },
            data: { status: 'CAPTURED' },
          });

          // Освобождаваме (RELEASED) депозитите на всички останали участници
          await prisma.deposit.updateMany({
            where: {
              auctionId: auction.id,
              userId: { not: highestBid.userId },
            },
            data: { status: 'RELEASED' },
          });
        });
        this.logger.log(`✅ Търг ${auction.id} приключи УСПЕШНО! Победител: ${highestBid.userId}`);
      
      } else {
        // --- СЦЕНАРИЙ Б: НЕУСПЕШЕН ТЪРГ (Не е достигната цена или няма бидове) ---
        await this.prisma.$transaction(async (prisma) => {
          // Затваряме търга като НЕУСПЕШЕН
          await prisma.auction.update({
            where: { id: auction.id },
            data: { status: 'FAILED' },
          });

          // Освобождаваме (RELEASED) депозитите на ВСИЧКИ участници
          await prisma.deposit.updateMany({
            where: { auctionId: auction.id },
            data: { status: 'RELEASED' },
          });
        });
        this.logger.log(`❌ Търг ${auction.id} приключи НЕУСПЕШНО. Всички депозити са освободени.`);
      }
    }
  }
}