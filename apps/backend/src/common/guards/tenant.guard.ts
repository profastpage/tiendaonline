import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Guard para identificar y validar el tenant
 * Soporta dos formas de identificación:
 * 1. Subdominio: tenant-slug.localhost:3000
 * 2. Header: X-Tenant-Slug
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Intentar obtener el slug del tenant de diferentes fuentes
    let tenantSlug: string | null = null;

    // 1. Desde header (para desarrollo o APIs directas)
    tenantSlug = request.headers['x-tenant-slug'];

    // 2. Desde subdominio (producción)
    if (!tenantSlug) {
      const host = request.headers.host;
      if (host) {
        const parts = host.split('.');
        // Si hay subdominio (ej: tenant.localhost o tenant.dominio.com)
        if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== 'www') {
          tenantSlug = parts[0];
        }
      }
    }

    // 3. Desde ruta (fallback)
    if (!tenantSlug) {
      tenantSlug = request.params.tenantSlug;
    }

    if (!tenantSlug) {
      throw new ForbiddenException('No se pudo identificar el tenant');
    }

    // Buscar tenant en base de datos
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant "${tenantSlug}" no encontrado`);
    }

    if (!tenant.activo) {
      throw new ForbiddenException('Tenant inactivo');
    }

    // Adjuntar tenant al request para uso posterior
    request.tenant = tenant;

    return true;
  }
}
