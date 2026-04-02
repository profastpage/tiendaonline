import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PedidosService, CreatePedidoDto, UpdatePedidoEstadoDto } from './pedidos.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentTenant, CurrentUser } from '../../common/decorators';

@ApiTags('pedidos')
@Controller('pedidos')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PedidosController {
  constructor(private pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido creado exitosamente' })
  async create(
    @CurrentTenant() tenant: any,
    @Body() createPedidoDto: CreatePedidoDto,
  ) {
    const pedido = await this.pedidosService.create(tenant.id, createPedidoDto);

    // Generar link de WhatsApp
    const whatsappLink = this.pedidosService.generarWhatsAppLink(tenant, pedido);

    return {
      ...pedido,
      whatsappLink,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener pedidos con filtros' })
  async findAll(
    @CurrentTenant() tenant: any,
    @Query('estado') estado?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.pedidosService.findAll(tenant.id, {
      estado,
      limit,
      offset,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de pedidos' })
  async getStats(@CurrentTenant() tenant: any) {
    return this.pedidosService.getStats(tenant.id);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtener estadísticas para dashboard' })
  async getDashboardStats(@CurrentTenant() tenant: any) {
    return this.pedidosService.getDashboardStats(tenant.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pedido por ID' })
  async findOne(@CurrentTenant() tenant: any, @Param('id') id: string) {
    const pedido = await this.pedidosService.findOne(tenant.id, id);

    // Generar link de WhatsApp
    const whatsappLink = this.pedidosService.generarWhatsAppLink(tenant, pedido);

    return {
      ...pedido,
      whatsappLink,
    };
  }

  @Put(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado del pedido' })
  async updateEstado(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body() updatePedidoEstadoDto: UpdatePedidoEstadoDto,
  ) {
    return this.pedidosService.updateEstado(tenant.id, id, updatePedidoEstadoDto);
  }

  @Post(':id/whatsapp')
  @ApiOperation({ summary: 'Generar link de WhatsApp para el pedido' })
  async generarWhatsappLink(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    const pedido = await this.pedidosService.findOne(tenant.id, id);
    const whatsappLink = this.pedidosService.generarWhatsAppLink(tenant, pedido);

    return {
      pedidoId: id,
      numeroPedido: pedido.numeroPedido,
      whatsappLink,
      mensaje: this.pedidosService.generarMensajeWhatsApp(pedido, tenant),
    };
  }
}
