import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionModule } from './auction/auction.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { KycController } from './kyc/kyc.controller';
import { UsersController } from './users/users.controller';
import { PropertiesController } from './properties/properties.controller'; // Внасяме контролера за имоти

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuctionModule, 
    AuthModule,
  ],
  controllers: [
    AppController, 
    KycController, 
    UsersController, 
    PropertiesController // Регистрираме го тук
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}