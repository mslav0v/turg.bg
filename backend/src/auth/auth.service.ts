import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. РЕГИСТРАЦИЯ
  async register(data: any) {
    // Проверка дали имейлът вече съществува
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Този имейл вече е регистриран.');
    }

    // Криптиране на паролата (солиране 10 пъти)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Създаване на потребителя в базата
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        fullName: data.fullName,
        role: data.role || 'BUYER',
      },
    });

    // Генерираме JWT токен веднага след успешна регистрация
    return this.generateToken(newUser);
  }

  // 2. ВХОД (LOGIN)
  async login(data: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('Грешен имейл или парола.');
    }

    // Проверка на криптираната парола
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Грешен имейл или парола.');
    }

    return this.generateToken(user);
  }

  // Помощен метод за генериране на JWT
  private generateToken(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        kycVerified: user.kycVerified,
      },
    };
  }
}