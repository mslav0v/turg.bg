import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Този обект идва от JwtAuthGuard

    if (!user) {
      throw new ForbiddenException('Няма достъп.');
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Достъпът е разрешен само за администратори.');
    }

    return true;
  }
}