import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'https://turg.bg',
      'https://www.turg.bg',
      'https://turg-bg.vercel.app'
    ],
    credentials: true,
  },
})
export class AuctionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AuctionGateway.name);

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    this.logger.log(`🔗 Клиент свързан: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ Клиент прекъсна връзка: ${client.id}`);
  }

  @SubscribeMessage('joinAuction')
  handleJoinAuction(
    @MessageBody() auctionId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(auctionId);
    return { event: 'joined', data: auctionId };
  }

  @SubscribeMessage('placeBid')
  async handlePlaceBid(
    @MessageBody() payload: { auctionId: string; amount: number; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // ---------------------------------------------------------
      // 1. ФИНАНСОВА КЛЮЧАЛКА (KYC & Deposit Validation)
      // ---------------------------------------------------------
      const buyer = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          deposits: {
            where: { 
              auctionId: payload.auctionId, 
              status: 'LOCKED' // Търсим точно блокиран депозит за ТОЗИ търг
            }
          }
        }
      });

      if (!buyer) {
        return { status: 'error', message: 'Потребителят не е намерен.' };
      }

      if (!buyer.kycVerified) {
        this.logger.warn(`🚨 БЛОКИРАН: Опит за наддаване от неверифициран профил (${buyer.email})`);
        return { status: 'error', message: 'Профилът ви не е преминал KYC верификация.' };
      }

      if (buyer.deposits.length === 0) {
        this.logger.warn(`🚨 БЛОКИРАН: Липсва валиден депозит за ${buyer.email} в търг ${payload.auctionId}`);
        return { status: 'error', message: 'Нямате платен гаранционен депозит за този търг.' };
      }

      // ---------------------------------------------------------
      // 2. ВАЛИДАЦИЯ НА ТЪРГА И ЦЕНАТА
      // ---------------------------------------------------------
      const auction = await this.prisma.auction.findUnique({
        where: { id: payload.auctionId },
      });

      if (!auction || auction.status !== 'ACTIVE') {
        return { status: 'error', message: 'Този търг е приключил или не е активен.' };
      }

      const now = new Date();
      if (now > auction.endTime) {
        return { status: 'error', message: 'Времето за наддаване изтече.' };
      }

      if (payload.amount <= Number(auction.currentPrice)) {
        return { status: 'error', message: 'Офертата трябва да е по-висока от текущата цена.' };
      }

      // ---------------------------------------------------------
      // 3. ANTI-SNIPING (Удължаване с 2 минути)
      // ---------------------------------------------------------
      const timeRemainingMs = auction.endTime.getTime() - now.getTime();
      const twoMinutesMs = 2 * 60 * 1000;
      let newEndTime = auction.endTime;

      if (timeRemainingMs < twoMinutesMs) {
        newEndTime = new Date(now.getTime() + twoMinutesMs);
        this.logger.log(`⏱️ Anti-sniping активиран! Удължен до ${newEndTime.toISOString()}`);
      }

      // ---------------------------------------------------------
      // 4. ACID ТРАНЗАКЦИЯ (Запис в базата)
      // ---------------------------------------------------------
      const updatedAuction = await this.prisma.auction.update({
        where: { id: payload.auctionId },
        data: {
          currentPrice: payload.amount,
          endTime: newEndTime,
          bids: {
            create: {
              userId: payload.userId,
              amount: payload.amount,
            },
          },
        },
      });

      // 5. ИЗЛЪЧВАНЕ КЪМ ВСИЧКИ
      this.server.to(payload.auctionId).emit('bidUpdated', {
        auctionId: payload.auctionId,
        newHighestBid: Number(updatedAuction.currentPrice),
        newEndTime: updatedAuction.endTime,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`✅ Успешен бит: €${payload.amount} от ${buyer.email}`);
      return { status: 'success', message: 'Успешно наддаване!' };

    } catch (error: any) {
      this.logger.error(`Системна грешка при наддаване: ${error.message}`);
      return { status: 'error', message: 'Възникна системна грешка.' };
    }
  }
}