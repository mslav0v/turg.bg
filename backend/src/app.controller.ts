import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('api')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('active-auction')
  async getActiveAuction() {
    // Взимаме първия активен търг заедно с данните за имота
    const auction = await this.prisma.auction.findFirst({
      where: { status: 'ACTIVE' },
      include: { property: true },
    });
    // Взимаме нашия тестов купувач
    const buyer = await this.prisma.user.findUnique({
      where: { email: 'buyer@turg.bg' },
    });

    return { auction, buyer };
  }
}