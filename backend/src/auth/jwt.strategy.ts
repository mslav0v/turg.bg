import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ТУК Е ФИКСЪТ: Добавяме резервен стринг, за да не се сърди TypeScript
      secretOrKey: configService.get<string>('JWT_SECRET') || 'super_secret_turg_bg_key_2026_xYz',
    });
  }

  // Този метод се изпълнява автоматично след успешно дешифриране на токена
  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Невалиден токен или изтрит профил.');
    }

    // Връщаме потребителя без паролата му
    const { passwordHash, ...result } = user;
    return result;
  }
}