import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface MovimientoInventarioDto {
  varianteId: string;
  tipoMovimiento: 'COMPRA' | 'VENTA' | 'DEVOLUCION' | 'AJUSTE' | 'MERMA';
  cantidad: number;
  motivo?: string;
}

@Injectable()
export class InventarioService {
  constructor(private prisma: PrismaService) {}

  /**
   * Registrar movimiento de inventario
   */
  async registrarMovimiento(
    tenantId: string,
    movimientoDto: MovimientoInventarioDto,
    usuarioId?: string,
  ) {
    const { varianteId, tipoMovimiento, cantidad, motivo } = movimientoDto;

    // Verificar que la variante pertenece al tenant
    const variante = await this.prisma.variante.findUnique({
      where: { id: varianteId },
      include: { producto: true },
    });

    if (!variante) {
      throw new NotFoundException('Variante no encontrada');
    }

    if (variante.producto.tenantId !== tenantId) {
      throw new NotFoundException('Variante no pertenece a este tenant');
    }

    // Para ventas y mermas, la cantidad debe ser negativa
    // Para compras, devoluciones y ajustes, puede ser positiva
    let cantidadFinal = cantidad;
    if (tipoMovimiento === 'VENTA' || tipoMovimiento === 'MERMA') {
      cantidadFinal = -Math.abs(cantidad);
    }

    const stockAnterior = variante.stock;
    const stockNuevo = Math.max(0, stockAnterior + cantidadFinal);

    // Validar que no haya stock negativo
    if (stockNuevo < 0) {
      throw new BadRequestException(
        `Stock insuficiente. Stock actual: ${stockAnterior}, movimiento: ${cantidadFinal}`,
      );
    }

    // Actualizar stock de la variante
    await this.prisma.variante.update({
      where: { id: varianteId },
      data: { stock: stockNuevo },
    });

    // Registrar movimiento
    const movimiento = await this.prisma.inventario.create({
      data: {
        varianteId,
        tipoMovimiento,
        cantidad: cantidadFinal,
        stockAnterior,
        stockNuevo,
        motivo,
        usuarioId,
      },
      include: {
        variante: {
          include: {
            producto: true,
          },
        },
      },
    });

    return movimiento;
  }

  /**
   * Obtener inventario actual del tenant
   */
  async getInventarioActual(tenantId: string, filtros?: {
    productoId?: string;
    stockMinimo?: number;
    sinStock?: boolean;
  }) {
    const where: any = {
      producto: {
        tenantId,
        activo: true,
      },
      activo: true,
    };

    if (filtros?.productoId) {
      where.productoId = filtros.productoId;
    }

    if (filtros?.sinStock) {
      where.stock = 0;
    } else if (filtros?.stockMinimo !== undefined) {
      where.stock = { lte: filtros.stockMinimo };
    }

    return this.prisma.variante.findMany({
      where,
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            slug: true,
            imagenPrincipal: true,
          },
        },
      },
      orderBy: [{ producto: { nombre: 'asc' } }, { talla: 'asc' }],
    });
  }

  /**
   * Obtener historial de movimientos
   */
  async getHistorialMovimientos(
    tenantId: string,
    filtros?: {
      varianteId?: string;
      tipoMovimiento?: string;
      fechaDesde?: string;
      fechaHasta?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: any = {
      variante: {
        producto: {
          tenantId,
        },
      },
    };

    if (filtros?.varianteId) {
      where.varianteId = filtros.varianteId;
    }

    if (filtros?.tipoMovimiento) {
      where.tipoMovimiento = filtros.tipoMovimiento;
    }

    if (filtros?.fechaDesde || filtros?.fechaHasta) {
      where.createdAt = {};
      if (filtros.fechaDesde) {
        where.createdAt.gte = new Date(filtros.fechaDesde);
      }
      if (filtros.fechaHasta) {
        where.createdAt.lte = new Date(filtros.fechaHasta);
      }
    }

    return this.prisma.inventario.findMany({
      where,
      include: {
        variante: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filtros?.limit || 50,
      skip: filtros?.offset || 0,
    });
  }

  /**
   * Obtener estadísticas de inventario
   */
  async getStats(tenantId: string) {
    const variantes = await this.prisma.variante.findMany({
      where: {
        producto: {
          tenantId,
          activo: true,
        },
        activo: true,
      },
      select: {
        stock: true,
        producto: {
          select: {
            nombre: true,
          },
        },
      },
    });

    const totalVariantes = variantes.length;
    const sinStock = variantes.filter((v) => v.stock === 0).length;
    const stockBajo = variantes.filter((v) => v.stock > 0 && v.stock <= 5).length;
    const stockTotal = variantes.reduce((sum, v) => sum + v.stock, 0);
    const stockPromedio = totalVariantes > 0 ? stockTotal / totalVariantes : 0;

    // Productos con stock bajo (al menos una variante con stock <= 5)
    const productosStockBajo = variantes
      .filter((v) => v.stock <= 5)
      .map((v) => ({
        producto: v.producto.nombre,
        variante: `${v.talla || 'N/A'} - ${v.color || 'N/A'}`,
        stock: v.stock,
      }));

    return {
      totalVariantes,
      sinStock,
      stockBajo,
      stockTotal,
      stockPromedio: Math.round(stockPromedio * 100) / 100,
      productosStockBajo: productosStockBajo.slice(0, 10), // Top 10
    };
  }

  /**
   * Actualizar stock directamente (ajuste manual)
   */
  async actualizarStock(
    tenantId: string,
    varianteId: string,
    nuevoStock: number,
    motivo: string,
    usuarioId?: string,
  ) {
    const variante = await this.prisma.variante.findUnique({
      where: { id: varianteId },
      include: { producto: true },
    });

    if (!variante) {
      throw new NotFoundException('Variante no encontrada');
    }

    if (variante.producto.tenantId !== tenantId) {
      throw new NotFoundException('Variante no pertenece a este tenant');
    }

    const stockAnterior = variante.stock;
    const diferencia = nuevoStock - stockAnterior;

    // Actualizar stock
    await this.prisma.variante.update({
      where: { id: varianteId },
      data: { stock: nuevoStock },
    });

    // Registrar como ajuste
    const movimiento = await this.prisma.inventario.create({
      data: {
        varianteId,
        tipoMovimiento: 'AJUSTE',
        cantidad: diferencia,
        stockAnterior,
        stockNuevo: nuevoStock,
        motivo,
        usuarioId,
      },
      include: {
        variante: {
          include: {
            producto: true,
          },
        },
      },
    });

    return movimiento;
  }
}
