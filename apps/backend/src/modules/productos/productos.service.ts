import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreateProductoDto {
  nombre: string;
  slug: string;
  descripcion?: string;
  precio: number;
  precioOferta?: number;
  categoriaId?: string;
  imagenPrincipal?: string;
  destacado?: boolean;
}

export interface UpdateProductoDto {
  nombre?: string;
  slug?: string;
  descripcion?: string;
  precio?: number;
  precioOferta?: number;
  categoriaId?: string;
  imagenPrincipal?: string;
  destacado?: boolean;
  activo?: boolean;
}

export interface CreateCategoriaDto {
  nombre: string;
  slug: string;
  descripcion?: string;
  imagenUrl?: string;
  orden?: number;
}

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // CATEGORIAS
  // ============================================

  async createCategoria(tenantId: string, createCategoriaDto: CreateCategoriaDto) {
    // Verificar que el slug no exista ya en el tenant
    const existing = await this.prisma.categoria.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug: createCategoriaDto.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ya existe una categoría con este slug');
    }

    return this.prisma.categoria.create({
      data: {
        tenantId,
        ...createCategoriaDto,
      },
      include: {
        _count: {
          select: { productos: true },
        },
      },
    });
  }

  async getCategorias(tenantId: string, incluirProductos = false) {
    return this.prisma.categoria.findMany({
      where: { tenantId, activo: true },
      orderBy: { orden: 'asc' },
      include: incluirProductos
        ? {
            _count: {
              select: { productos: true },
            },
          }
        : undefined,
    });
  }

  async getCategoriaById(tenantId: string, id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: {
          where: { activo: true },
          include: {
            variantes: {
              where: { activo: true, stock: { gt: 0 } },
            },
          },
        },
      },
    });

    if (!categoria || categoria.tenantId !== tenantId) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async updateCategoria(tenantId: string, id: string, data: Partial<CreateCategoriaDto>) {
    const categoria = await this.getCategoriaById(tenantId, id);

    return this.prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async deleteCategoria(tenantId: string, id: string) {
    await this.getCategoriaById(tenantId, id);

    return this.prisma.categoria.update({
      where: { id },
      data: { activo: false },
    });
  }

  // ============================================
  // PRODUCTOS
  // ============================================

  async createProducto(tenantId: string, createProductoDto: CreateProductoDto) {
    // Verificar que el slug no exista ya en el tenant
    const existing = await this.prisma.producto.findUnique({
      where: {
        tenantId_slug: {
          tenantId,
          slug: createProductoDto.slug,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ya existe un producto con este slug');
    }

    // Verificar categoría si se proporciona
    if (createProductoDto.categoriaId) {
      const categoria = await this.prisma.categoria.findUnique({
        where: { id: createProductoDto.categoriaId },
      });

      if (!categoria || categoria.tenantId !== tenantId) {
        throw new NotFoundException('Categoría no encontrada');
      }
    }

    return this.prisma.producto.create({
      data: {
        tenantId,
        ...createProductoDto,
        precio: new Decimal(createProductoDto.precio),
        precioOferta: createProductoDto.precioOferta
          ? new Decimal(createProductoDto.precioOferta)
          : null,
      },
      include: {
        categoria: true,
        variantes: true,
      },
    });
  }

  async getProductos(tenantId: string, filtros?: {
    categoriaId?: string;
    destacado?: boolean;
    activo?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = { tenantId };

    if (filtros) {
      if (filtros.categoriaId !== undefined) {
        where.categoriaId = filtros.categoriaId;
      }
      if (filtros.destacado !== undefined) {
        where.destacado = filtros.destacado;
      }
      if (filtros.activo !== undefined) {
        where.activo = filtros.activo;
      }
      if (filtros.search) {
        where.OR = [
          { nombre: { contains: filtros.search, mode: 'insensitive' } },
          { descripcion: { contains: filtros.search, mode: 'insensitive' } },
        ];
      }
    }

    return this.prisma.producto.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        categoria: true,
        variantes: {
          where: { activo: true },
        },
        _count: {
          select: { variantes: true },
        },
      },
      take: filtros?.limit,
      skip: filtros?.offset,
    });
  }

  async getProductoById(tenantId: string, id: string) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: true,
        variantes: {
          where: { activo: true },
          orderBy: { talla: 'asc' },
        },
      },
    });

    if (!producto || producto.tenantId !== tenantId) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async getProductoBySlug(tenantId: string, slug: string) {
    const producto = await this.prisma.producto.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: {
        categoria: true,
        variantes: {
          where: { activo: true },
          orderBy: { talla: 'asc' },
        },
      },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async updateProducto(tenantId: string, id: string, updateProductoDto: UpdateProductoDto) {
    const producto = await this.getProductoById(tenantId, id);

    const data: any = { ...updateProductoDto };

    if (updateProductoDto.precio) {
      data.precio = new Decimal(updateProductoDto.precio);
    }
    if (updateProductoDto.precioOferta !== undefined) {
      data.precioOferta = updateProductoDto.precioOferta
        ? new Decimal(updateProductoDto.precioOferta)
        : null;
    }

    return this.prisma.producto.update({
      where: { id },
      data,
      include: {
        categoria: true,
        variantes: true,
      },
    });
  }

  async deleteProducto(tenantId: string, id: string) {
    await this.getProductoById(tenantId, id);

    // Soft delete - desactivar producto
    return this.prisma.producto.update({
      where: { id },
      data: { activo: false },
    });
  }

  async toggleProductoStatus(tenantId: string, id: string) {
    const producto = await this.getProductoById(tenantId, id);

    return this.prisma.producto.update({
      where: { id },
      data: { activo: !producto.activo },
    });
  }

  // ============================================
  // VARIANTES
  // ============================================

  async createVariante(
    tenantId: string,
    productoId: string,
    data: {
      talla?: string;
      color?: string;
      colorHex?: string;
      sku?: string;
      precio?: number;
      stock?: number;
    },
  ) {
    // Verificar que el producto pertenece al tenant
    const producto = await this.getProductoById(tenantId, productoId);

    // Verificar que no exista variante duplicada
    const existing = await this.prisma.variante.findUnique({
      where: {
        productoId_talla_color: {
          productoId,
          talla: data.talla || null,
          color: data.color || null,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Ya existe una variante con estas características');
    }

    return this.prisma.variante.create({
      data: {
        productoId,
        ...data,
        precio: data.precio ? new Decimal(data.precio) : null,
        stock: data.stock || 0,
      },
    });
  }

  async createVariantes(
    tenantId: string,
    productoId: string,
    variantes: Array<{
      talla?: string;
      color?: string;
      colorHex?: string;
      sku?: string;
      precio?: number;
      stock?: number;
    }>,
  ) {
    await this.getProductoById(tenantId, productoId);

    const created = await this.prisma.variante.createMany({
      data: variantes.map((v) => ({
        productoId,
        ...v,
        precio: v.precio ? new Decimal(v.precio) : null,
        stock: v.stock || 0,
      })),
      skipDuplicates: true,
    });

    return created;
  }

  async getVariantes(tenantId: string, productoId: string) {
    await this.getProductoById(tenantId, productoId);

    return this.prisma.variante.findMany({
      where: { productoId, activo: true },
      orderBy: [{ talla: 'asc' }, { color: 'asc' }],
    });
  }

  async updateVariante(
    tenantId: string,
    productoId: string,
    varianteId: string,
    data: Partial<{
      talla: string;
      color: string;
      colorHex: string;
      sku: string;
      precio: number;
      stock: number;
      activo: boolean;
    }>,
  ) {
    const variante = await this.prisma.variante.findUnique({
      where: { id: varianteId },
    });

    if (!variante || variante.productoId !== productoId) {
      throw new NotFoundException('Variante no encontrada');
    }

    // Verificar que el producto pertenece al tenant
    await this.getProductoById(tenantId, productoId);

    const updateData: any = { ...data };
    if (data.precio !== undefined) {
      updateData.precio = data.precio ? new Decimal(data.precio) : null;
    }

    return this.prisma.variante.update({
      where: { id: varianteId },
      data: updateData,
    });
  }

  async deleteVariante(tenantId: string, productoId: string, varianteId: string) {
    await this.getProductoById(tenantId, productoId);

    return this.prisma.variante.update({
      where: { id: varianteId },
      data: { activo: false },
    });
  }

  async getVarianteById(tenantId: string, varianteId: string) {
    const variante = await this.prisma.variante.findUnique({
      where: { id: varianteId },
      include: { producto: true },
    });

    if (!variante) {
      throw new NotFoundException('Variante no encontrada');
    }

    await this.getProductoById(tenantId, variante.productoId);

    return variante;
  }
}
