import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string; // usuarioId
  email: string;
  tenantId: string;
  rol: string;
}

/**
 * Guard para autenticación con JWT
 * Valida el token y adjunta el usuario al request
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No se proporcionó token de autenticación');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Verificar que el usuario existe y está activo
      const user = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
        include: { tenant: true },
      });

      if (!user || !user.activo) {
        throw new UnauthorizedException('Usuario no válido o inactivo');
      }

      // Verificar que el usuario pertenece al tenant actual (si existe)
      if (request.tenant && user.tenantId !== request.tenant.id) {
        throw new UnauthorizedException('Usuario no pertenece a este tenant');
      }

      // Adjuntar usuario al request (sin password)
      const { passwordHash, ...userWithoutPassword } = user;
      request.user = userWithoutPassword;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

/**
 * Guard opcional - no falla si no hay token
 * Útil para endpoints que funcionan para usuarios anónimos y autenticados
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      return true; // Permitir continuar sin token
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
        include: { tenant: true },
      });

      if (user && user.activo) {
        const { passwordHash, ...userWithoutPassword } = user;
        request.user = userWithoutPassword;
      }
    } catch (error) {
      // Ignorar errores - permitir continuar sin autenticación
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
