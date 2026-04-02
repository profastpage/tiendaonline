import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventarioService, MovimientoInventarioDto } from './inventario.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentTenant, CurrentUser } from '../../common/decorators';

@ApiTags('inventario')
@Controller('inventario')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class InventarioController {
  constructor(private inventarioService: InventarioService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener inventario actual del tenant' })
  async getInventarioActual(
    @CurrentTenant() tenant: any,
    @Query('productoId') productoId?: string,
    @Query('stockMinimo') stockMinimo?: number,
    @Query('sinStock') sinStock?: string,
  ) {
    return this.inventarioService.getInventarioActual(tenant.id, {
      productoId,
      stockMinimo,
      sinStock: sinStock === 'true',
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de inventario' })
  async getStats(@CurrentTenant() tenant: any) {
    return this.inventarioService.getStats(tenant.id);
  }

  @Get('movimientos')
  @ApiOperation({ summary: 'Obtener historial de movimientos' })
  async getHistorialMovimientos(
    @CurrentTenant() tenant: any,
    @Query('varianteId') varianteId?: string,
    @Query('tipoMovimiento') tipoMovimiento?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.inventarioService.getHistorialMovimientos(tenant.id, {
      varianteId,
      tipoMovimiento,
      fechaDesde,
      fechaHasta,
      limit,
      offset,
    });
  }

  @Post('movimientos')
  @ApiOperation({ summary: 'Registrar nuevo movimiento de inventario' })
  @ApiResponse({ status: 201, description: 'Movimiento registrado exitosamente' })
  async registrarMovimiento(
    @CurrentTenant() tenant: any,
    @CurrentUser() user: any,
    @Body() movimientoDto: MovimientoInventarioDto,
  ) {
    return this.inventarioService.registrarMovimiento(
      tenant.id,
      movimientoDto,
      user.id,
    );
  }

  @Post('variantes/:varianteId/ajustar')
  @ApiOperation({ summary: 'Ajustar stock de variante manualmente' })
  async ajustarStock(
    @CurrentTenant() tenant: any,
    @CurrentUser() user: any,
    @Param('varianteId') varianteId: string,
    @Body('nuevoStock') nuevoStock: number,
    @Body('motivo') motivo: string,
  ) {
    return this.inventarioService.actualizarStock(
      tenant.id,
      varianteId,
      nuevoStock,
      motivo,
      user.id,
    );
  }
}
