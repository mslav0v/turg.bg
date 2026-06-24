import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Взимане на данните на логнатия потребител
  @Get('profile')
  async getProfile(@Req() req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true, fullName: true, companyName: true, iban: true, kycVerified: true }
    });
    return user;
  }

  // 2. Обновяване на данните (Имена, Фирма, IBAN)
  @Put('profile')
  async updateProfile(@Req() req: any, @Body() body: { fullName: string; companyName?: string; iban?: string }) {
    return this.prisma.user.update({
      where: { id: req.user.id },
      data: {
        fullName: body.fullName,
        companyName: body.companyName,
        iban: body.iban,
      },
      select: { email: true, fullName: true, companyName: true, iban: true }
    });
  }
}