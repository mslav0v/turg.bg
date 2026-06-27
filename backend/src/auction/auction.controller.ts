import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/auctions')
export class AuctionController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. ПУБЛИЧЕН МАРШРУТ (GET /api/auctions)
  // Използва се от фронтенда за Заглавната страница и Списъка с търгове
  @Get()
  async getAllActiveAuctions() {
    return this.prisma.auction.findMany({
      where: { status: 'ACTIVE' },
      include: {
        asset: true, // Включваме данните за самия актив (имот, машина, МПС и др.)
      },
      orderBy: { endTime: 'asc' }, // Най-скоро изтичащите са първи
    });
  }

  // 2. ЗАЩИТЕН МАРШРУТ (POST /api/auctions)
  // Използва се от "Портала за продавачи"
  @UseGuards(JwtAuthGuard)
  @Post()
  async createAuction(@Request() req, @Body() body: any) {
    // req.user идва автоматично от дешифрирания JWT токен!
    const user = req.user;

    // Проверяваме дали логнатият потребител има права на ПРОДАВАЧ
    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Само верифицирани продавачи могат да създават търгове.');
    }

    // Извършваме създаването на актива и търга в една ACID транзакция
    return this.prisma.$transaction(async (prisma) => {
      // 1. Създаваме актива с неговия тип и специфични технически характеристики
      const asset = await prisma.asset.create({
        data: {
          title: body.title,
          location: body.location,
          description: body.description || 'Няма въведено описание.',
          assetType: body.assetType, // Напр. PROPERTY, VEHICLE, CONSTRUCTION_MACHINERY
          latitude: body.latitude ? parseFloat(body.latitude) : null,
          longitude: body.longitude ? parseFloat(body.longitude) : null,
          specifications: body.specifications || {}, // Специфичните данни за съответната категория като JSON
          sellerId: user.id, // Взимаме ID-то директно от сигурния токен
        },
      });

      // 2. Създаваме търга към този актив
      const auction = await prisma.auction.create({
        data: {
          assetId: asset.id,
          startPrice: body.startPrice,
          reservePrice: body.reservePrice,
          currentPrice: body.startPrice, // В началото текущата цена е равна на началната
          startTime: new Date(body.startTime),
          endTime: new Date(body.endTime),
          status: 'ACTIVE',
        },
      });

      return { asset, auction };
    });
  }
}