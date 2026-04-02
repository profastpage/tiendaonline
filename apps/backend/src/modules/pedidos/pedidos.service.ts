import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export interface CreatePedidoDto {
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  notas?: string;
  items: Array<{
    productoId: string;
    varianteId?: string;
    cantidad: number;
  }>;
}

export interface UpdatePedidoEstadoDto {
  estado: 'PENDIENTE' | 'CONFIRMADO' | 'EN_PREPARACION' | 'LISTO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  notasInternas?: string;
}

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generar número de pedido único por tenant
   */
  private async generarNumeroPedido(tenantId: string): Promise<string> {
    const ultimoPedido = await this.prisma.pedido.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { numeroPedido: true },
    });

    if (!ultimoPedido) {
      return 'PED-0001';
    }

    const numeroActual = parseInt(ultimoPedido.numeroPedido.split('-')[1]);
    const nuevoNumero = numeroActual + 1;

    return `PED-${String(nuevoNumero).padStart(4, '0')}`;
  }

  /**
   * Crear nuevo pedido
   */
  async create(tenantId: string, createPedidoDto: CreatePedidoDto) {
    const numeroPedido = await this.generarNumeroPedido(tenantId);

    // Calcular totales y validar items
    const itemsConPrecios = await Promise.all(
      createPedidoDto.items.map(async (item) => {
        const producto = await this.prisma.producto.findUnique({
          where: { id: item.productoId },
          include: { variantes: true },
        });

        if (!producto || producto.tenantId !== tenantId) {
          throw new NotFoundException(`Producto "${item.productoId}" no encontrado`);
        }

        let variante;
        if (item.varianteId) {
          variante = producto.variantes.find((v) => v.id === item.varianteId);
          if (!variante) {
            throw new NotFoundException(`Variante "${item.varianteId}" no encontrada`);
          }
        }

        // Determinar precio (usar precio de variante si existe, sino el del producto)
        const precioUnitario = variante?.precio
          ? Number(variante.precio)
          : Number(producto.precioOferta || producto.precio);

        const subtotal = precioUnitario * item.cantidad;

        return {
          productoId: item.productoId,
          varianteId: item.varianteId,
          cantidad: item.cantidad,
          precioUnitario,
          subtotal,
          productoNombre: producto.nombre,
          varianteInfo: variante
            ? {
                talla: variante.talla,
                color: variante.color,
                sku: variante.sku,
              }
            : null,
        };
      }),
    );

    const subtotal = itemsConPrecios.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal; // Se podría agregar descuento e impuestos aquí

    // Crear pedido en transacción
    const pedido = await this.prisma.pedido.create({
      data: {
        tenantId,
        numeroPedido,
        estado: 'PENDIENTE',
        clienteNombre: createPedidoDto.clienteNombre,
        clienteTelefono: createPedidoDto.clienteTelefono,
        clienteEmail: createPedidoDto.clienteEmail,
        subtotal: new Decimal(subtotal),
        descuento: new Decimal(0),
        total: new Decimal(total),
        notas: createPedidoDto.notas,
        items: {
          create: itemsConPrecios.map((item) => ({
            productoId: item.productoId,
            varianteId: item.varianteId,
            cantidad: item.cantidad,
            precioUnitario: new Decimal(item.precioUnitario),
            subtotal: new Decimal(item.subtotal),
          })),
        },
      },
      include: {
        items: {
          include: {
            producto: true,
            variante: true,
          },
        },
      },
    });

    // Actualizar inventario
    for (const item of createPedidoDto.items) {
      if (item.varianteId) {
        await this.actualizarInventario(tenantId, item.varianteId, -item.cantidad, 'VENTA');
      }
    }

    return {
      ...pedido,
      items: itemsConPrecios,
      numeroPedido,
      total,
    };
  }

  /**
   * Actualizar inventario después de una venta
   */
  private async actualizarInventario(
    tenantId: string,
    varianteId: string,
    cantidad: number,
    tipoMovimiento: 'VENTA' | 'COMPRA' | 'DEVOLUCION' | 'AJUSTE' | 'MERMA',
  ) {
    const variante = await this.prisma.variante.findUnique({
      where: { id: varianteId },
    });

    if (!variante) return;

    const stockAnterior = variante.stock;
    const stockNuevo = Math.max(0, stockAnterior + cantidad);

    // Actualizar stock de la variante
    await this.prisma.variante.update({
      where: { id: varianteId },
      data: { stock: stockNuevo },
    });

    // Registrar movimiento de inventario
    await this.prisma.inventario.create({
      data: {
        varianteId,
        tipoMovimiento,
        cantidad,
        stockAnterior,
        stockNuevo,
        motivo: tipoMovimiento === 'VENTA' ? 'Pedido vendido' : undefined,
      },
    });
  }

  /**
   * Obtener todos los pedidos del tenant
   */
  async findAll(tenantId: string, filtros?: {
    estado?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = { tenantId };

    if (filtros?.estado) {
      where.estado = filtros.estado;
    }

    return this.prisma.pedido.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            producto: true,
            variante: true,
          },
        },
      },
      take: filtros?.limit,
      skip: filtros?.offset,
    });
  }

  /**
   * Obtener pedido por ID
   */
  async findOne(tenantId: string, id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            producto: true,
            variante: true,
          },
        },
      },
    });

    if (!pedido || pedido.tenantId !== tenantId) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  /**
   * Actualizar estado del pedido
   */
  async updateEstado(
    tenantId: string,
    id: string,
    updatePedidoEstadoDto: UpdatePedidoEstadoDto,
  ) {
    const pedido = await this.findOne(tenantId, id);

    return this.prisma.pedido.update({
      where: { id },
      data: {
        estado: updatePedidoEstadoDto.estado,
        notasInternas: updatePedidoEstadoDto.notasInternas,
      },
      include: {
        items: {
          include: {
            producto: true,
            variante: true,
          },
        },
      },
    });
  }

  /**
   * Generar mensaje de WhatsApp para el pedido
   */
  generarMensajeWhatsApp(pedido: any, tenant: any): string {
    let mensaje = `👋 *¡Hola ${tenant.nombre}!*\n\n`;
    mensaje += `📦 *Nuevo Pedido #${pedido.numeroPedido}*\n\n`;
    mensaje += `👤 *Cliente:* ${pedido.clienteNombre}\n`;
    mensaje += `📱 *Teléfono:* ${pedido.clienteTelefono}\n\n`;
    mensaje += `🛍️ *Productos:*\n\n`;

    pedido.items.forEach((item: any, index: number) => {
      mensaje += `${index + 1}. *${item.producto.nombre}*\n`;

      if (item.variante) {
        const varianteInfo = [];
        if (item.variante.talla) varianteInfo.push(`Talla: ${item.variante.talla}`);
        if (item.variante.color) varianteInfo.push(`Color: ${item.variante.color}`);
        if (varianteInfo.length > 0) {
          mensaje += `   ${varianteInfo.join(' | ')}\n`;
        }
      }

      mensaje += `   ${item.cantidad} x S/ ${Number(item.precioUnitario).toFixed(2)} = S/ ${Number(item.subtotal).toFixed(2)}\n\n`;
    });

    mensaje += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `💰 *TOTAL: S/ ${Number(pedido.total).toFixed(2)}*\n`;

    if (pedido.notas) {
      mensaje += `\n📝 *Notas:* ${pedido.notas}`;
    }

    mensaje += `\n\n_Generado automáticamente por la tienda online_`;

    return mensaje;
  }

  /**
   * Generar link de WhatsApp para enviar pedido
   */
  generarWhatsAppLink(tenant: any, pedido: any): string {
    const mensaje = this.generarMensajeWhatsApp(pedido, tenant);
    const mensajeEncoded = encodeURIComponent(mensaje);

    // Limpiar número de teléfono (quitar +, espacios, guiones)
    const numeroLimpio = tenant.whatsappNumero.replace(/[\s\-\+]/g, '');

    return `https://wa.me/${numeroLimpio}?text=${mensajeEncoded}`;
  }

  /**
   * Obtener estadísticas de pedidos
   */
  async getStats(tenantId: string) {
    const pedidos = await this.prisma.pedido.findMany({
      where: { tenantId },
      select: {
        estado: true,
        total: true,
        createdAt: true,
      },
    });

    const stats = {
      total: pedidos.length,
      porEstado: {
        PENDIENTE: 0,
        CONFIRMADO: 0,
        EN_PREPARACION: 0,
        LISTO: 0,
        ENVIADO: 0,
        ENTREGADO: 0,
        CANCELADO: 0,
      },
      totalVentas: 0,
      ticketPromedio: 0,
    };

    pedidos.forEach((pedido) => {
      stats.porEstado[pedido.estado]++;
      if (pedido.estado !== 'CANCELADO') {
        stats.totalVentas += Number(pedido.total);
      }
    });

    const pedidosNoCancelados = pedidos.filter((p) => p.estado !== 'CANCELADO').length;
    stats.ticketPromedio = pedidosNoCancelados > 0
      ? stats.totalVentas / pedidosNoCancelados
      : 0;

    return stats;
  }

  /**
   * Obtener pedidos recientes para dashboard
   */
  async getDashboardStats(tenantId: string) {
    const stats = await this.getStats(tenantId);

    // Pedidos de los últimos 7 días
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    const pedidosRecientes = await this.prisma.pedido.findMany({
      where: {
        tenantId,
        createdAt: { gte: hace7Dias },
      },
      select: {
        numeroPedido: true,
        clienteNombre: true,
        total: true,
        estado: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      ...stats,
      pedidosRecientes,
    };
  }
}
