import { Controller, Get, Put, Post, Param, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import * as bcrypt from 'bcrypt';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  // --- ТАБЛО (DASHBOARD) ---
  @Get('dashboard-stats')
  async getStats() {
    const totalUsers = await this.prisma.user.count();
    const activeAuctions = await this.prisma.auction.count({ where: { status: 'ACTIVE' } });
    const totalDeposits = await this.prisma.deposit.aggregate({
      _sum: { amount: true },
      where: { status: 'LOCKED' }
    });

    return {
      users: totalUsers,
      auctions: activeAuctions,
      lockedDeposits: totalDeposits._sum.amount || 0,
    };
  }

  // --- ПОТРЕБИТЕЛИ (USERS) ---
  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, fullName: true, companyName: true,
        role: true, kycVerified: true, createdAt: true,
      }
    });
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    const updateData: any = {
      email: data.email,
      fullName: data.fullName,
      companyName: data.companyName,
      role: data.role,
      kycVerified: data.kycVerified,
    };

    if (data.password && data.password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, fullName: true, companyName: true, role: true, kycVerified: true, createdAt: true }
    });
  }

  @Post('users/:id/reset-password')
  async sendPasswordResetEmail(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      throw new Error('Потребителят не е намерен.');
    }

    console.log(`[EMAIL SYSTEM]: Изпратен линк за възстановяване на парола до -> ${user.email}`);
    return { message: `Имейлът до ${user.email} е изпратен успешно.` };
  }

  // --- KYC УПРАВЛЕНИЕ (НОВО) ---
  
  @Get('kyc')
  async getAllKycRequests() {
    return this.prisma.kycRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true, companyName: true } }
      }
    });
  }

  @Put('kyc/:id/approve')
  async approveKyc(@Param('id') id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const kyc = await prisma.kycRequest.update({
        where: { id },
        data: { status: 'APPROVED', rejectionReason: null },
      });

      await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycVerified: true },
      });

      return kyc;
    });
  }

  @Put('kyc/:id/reject')
  async rejectKyc(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.prisma.$transaction(async (prisma) => {
      const kyc = await prisma.kycRequest.update({
        where: { id },
        data: { status: 'REJECTED', rejectionReason: body.reason },
      });

      await prisma.user.update({
        where: { id: kyc.userId },
        data: { kycVerified: false },
      });

      return kyc;
    });
  }
}