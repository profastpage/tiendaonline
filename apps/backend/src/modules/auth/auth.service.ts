import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nombre: string;
  tenantSlug: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registrar un nuevo usuario en un tenant existente
   */
  async register(registerDto: RegisterDto) {
    const { email, password, nombre, tenantSlug } = registerDto;

    // Verificar que el tenant existe
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new ConflictException('Tenant no encontrado');
    }

    // Verificar si el email ya existe en el tenant
    const existingUser = await this.prisma.usuario.findUnique({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email,
        },
      },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado en este tenant');
    }

    // Hashear password
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await this.prisma.usuario.create({
      data: {
        tenantId: tenant.id,
        email,
        passwordHash,
        nombre,
        rol: 'VENDEDOR', // Rol por defecto
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            nombre: true,
            slug: true,
          },
        },
      },
    });

    return usuario;
  }

  /**
   * Login de usuario
   */
  async login(loginDto: LoginDto, tenantSlug?: string) {
    const { email, password } = loginDto;

    // Buscar usuario por email
    let usuario;

    if (tenantSlug) {
      // Búsqueda dentro de un tenant específico
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: tenantSlug },
      });

      if (!tenant) {
        throw new UnauthorizedException('Tenant no encontrado');
      }

      usuario = await this.prisma.usuario.findUnique({
        where: {
          tenantId_email: {
            tenantId: tenant.id,
            email,
          },
        },
        include: { tenant: true },
      });
    } else {
      // Búsqueda global (primer match)
      const usuarios = await this.prisma.usuario.findMany({
        where: { email },
        include: { tenant: true },
      });

      if (usuarios.length === 0) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Si hay múltiples, usar el primero (o se podría requerir tenantSlug)
      usuario = usuarios[0];
    }

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar password
    const passwordValid = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar JWT
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tenantId: usuario.tenantId,
      rol: usuario.rol,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    });

    const { passwordHash, ...userWithoutPassword } = usuario;

    return {
      user: userWithoutPassword,
      access_token,
    };
  }

  /**
   * Cambiar password del usuario actual
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar password actual
    const passwordValid = await bcrypt.compare(currentPassword, usuario.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException('Password actual inválido');
    }

    // Hashear nuevo password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar password
    await this.prisma.usuario.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Password actualizado correctamente' };
  }
}
