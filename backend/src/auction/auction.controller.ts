import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as crypto from 'crypto'; // НАДГРАЖДАНЕ: Сигурен модул за генериране на криптографски ключове

@Controller('api/auctions')
export class AuctionController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. ПУБЛИЧЕН МАРШРУТ (GET /api/auctions)
  // Използва се от фронтенда за Заглавната страница и Списъка с търгове
  @Get()
  async getAllActiveAuctions() {
    return this.prisma.auction.findMany({
      where: { 
        status: 'ACTIVE',
        isPrivate: false // НАДГРАЖДАНЕ: Скриваме конфиденциалните търгове от общия публичен списък
      },
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
          specifications: body.specifications || {}, // Специфичните данни за съответната категория као JSON
          sellerId: user.id, // Взимаме ID-то директно от сигурния токен
        },
      });

      // Проверяваме конфигурацията за сигурност на търга от тялото на заявката
      const isPrivate = body.isPrivate === true || body.isPrivate === 'true';

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
          isPrivate: isPrivate, // НАДГРАЖДАНЕ: Маркираме дали стаята е секретна
        },
      });

      // 3. НАДГРАЖДАНЕ: Ако търгът е частен, генерираме персонални пропуски за поканените инвеститори
      const invitations: any[] = [];
      if (isPrivate && Array.isArray(body.invitedEmails)) {
        for (const email of body.invitedEmails) {
          const uniqueToken = `turg_sec_${crypto.randomBytes(16).toString('hex')}`;
          
          const invitation = await prisma.auctionInvitation.create({
            data: {
              auctionId: auction.id,
              email: email.trim(),
              token: uniqueToken,
            },
          });
          invitations.push(invitation);
        }
      }

      return { asset, auction, invitations };
    });
  }

  // 3. НОВ МАРШРУТ ЗА ДОСТЪП ДО СЕКРЕТНА СТАЯ (POST /api/auctions/private/verify)
  // Позволява на купувачи с персонален дигитален ключ да отключат залата за наддаване
  @Post('private/verify')
  async verifyPrivateAuctionKey(@Body() body: any) {
    if (!body.token) {
      throw new ForbiddenException('Липсва дигитален ключ за достъп.');
    }

    // Търсим поканата по предоставения уникален токен
    const invitation = await this.prisma.auctionInvitation.findUnique({
      where: { token: body.token },
      include: {
        auction: {
          include: {
            asset: true,
          },
        },
      },
    });

    // Проверяваме дали такъв ключ съществува и дали съответният търг все още е активен
    if (!invitation || invitation.auction.status !== 'ACTIVE') {
      throw new ForbiddenException('Невалиден, блокиран или изтекъл ключ за достъп.');
    }

    // Ако ключът се използва за първи път, отчитаме активацията му в базата данни
    if (!invitation.used) {
      await this.prisma.auctionInvitation.update({
        where: { id: invitation.id },
        data: { used: true },
      });
    }

    // Връщаме детайлите за обекта и залата на оторизирания потребител
    return {
      asset: invitation.auction.asset,
      auction: invitation.auction,
    };
  }
}