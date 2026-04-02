import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateTenantDto {
  nombre: string;
  slug: string;
  descripcion?: string;
  whatsappNumero: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  moneda?: string;
}

export interface UpdateTenantDto {
  nombre?: string;
  descripcion?: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsappNumero?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  moneda?: string;
  activo?: boolean;
}

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crear un nuevo tenant
   */
  async create(createTenantDto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: createTenantDto,
    });
  }

  /**
   * Obtener todos los tenants activos
   */
  async findAll() {
    return this.prisma.tenant.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    });
  }

  /**
   * Obtener tenant por slug
   */
  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant "${slug}" no encontrado`);
    }

    return tenant;
  }

  /**
   * Obtener tenant por ID con información completa
   */
  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            productos: true,
            pedidos: true,
            usuarios: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant "${id}" no encontrado`);
    }

    return tenant;
  }

  /**
   * Actualizar tenant
   */
  async update(id: string, updateTenantDto: UpdateTenantDto) {
    await this.findById(id); // Verificar que existe

    return this.prisma.tenant.update({
      where: { id },
      data: updateTenantDto,
    });
  }

  /**
   * Activar/desactivar tenant
   */
  async toggleStatus(id: string) {
    const tenant = await this.findById(id);

    return this.prisma.tenant.update({
      where: { id },
      data: { activo: !tenant.activo },
    });
  }

  /**
   * Obtener estadísticas del tenant
   */
  async getStats(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        productos: {
          select: { id: true, activo: true },
        },
        pedidos: {
          select: { id: true, estado: true, total: true, createdAt: true },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant "${id}" no encontrado`);
    }

    const productosActivos = tenant.productos.filter((p) => p.activo).length;
    const totalVentas = tenant.pedidos.reduce(
      (sum, p) => sum + Number(p.total),
      0,
    );

    return {
      totalProductos: tenant.productos.length,
      productosActivos,
      totalPedidos: tenant.pedidos.length,
      totalVentas,
    };
  }
}
