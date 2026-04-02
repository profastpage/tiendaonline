import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductosService, CreateProductoDto, UpdateProductoDto, CreateCategoriaDto } from './productos.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser, CurrentTenant } from '../../common/decorators';

@ApiTags('productos')
@Controller('productos')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ProductosController {
  constructor(private productosService: ProductosService) {}

  // ============================================
  // CATEGORIAS
  // ============================================

  @Post('categorias')
  @ApiOperation({ summary: 'Crear nueva categoría' })
  async createCategoria(
    @CurrentTenant() tenant: any,
    @Body() createCategoriaDto: CreateCategoriaDto,
  ) {
    return this.productosService.createCategoria(tenant.id, createCategoriaDto);
  }

  @Get('categorias')
  @ApiOperation({ summary: 'Obtener categorías del tenant' })
  async getCategorias(
    @CurrentTenant() tenant: any,
    @Query('conProductos') conProductos?: string,
  ) {
    return this.productosService.getCategorias(
      tenant.id,
      conProductos === 'true',
    );
  }

  @Get('categorias/:id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  async getCategoriaById(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.productosService.getCategoriaById(tenant.id, id);
  }

  @Put('categorias/:id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  async updateCategoria(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body() data: Partial<CreateCategoriaDto>,
  ) {
    return this.productosService.updateCategoria(tenant.id, id, data);
  }

  @Delete('categorias/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar categoría (soft delete)' })
  async deleteCategoria(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.productosService.deleteCategoria(tenant.id, id);
  }

  // ============================================
  // PRODUCTOS
  // ============================================

  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  async createProducto(
    @CurrentTenant() tenant: any,
    @Body() createProductoDto: CreateProductoDto,
  ) {
    return this.productosService.createProducto(tenant.id, createProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener productos con filtros' })
  async getProductos(
    @CurrentTenant() tenant: any,
    @Query('categoriaId') categoriaId?: string,
    @Query('destacado') destacado?: string,
    @Query('activo') activo?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.productosService.getProductos(tenant.id, {
      categoriaId,
      destacado: destacado === 'true',
      activo: activo !== 'false', // Por defecto mostrar activos
      search,
      limit,
      offset,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  async getProductoById(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.productosService.getProductoById(tenant.id, id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener producto por slug' })
  async getProductoBySlug(
    @CurrentTenant() tenant: any,
    @Param('slug') slug: string,
  ) {
    return this.productosService.getProductoBySlug(tenant.id, slug);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  async updateProducto(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.updateProducto(tenant.id, id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar producto (soft delete)' })
  async deleteProducto(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.productosService.deleteProducto(tenant.id, id);
  }

  @Post(':id/toggle-status')
  @ApiOperation({ summary: 'Activar/desactivar producto' })
  async toggleProductoStatus(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
  ) {
    return this.productosService.toggleProductoStatus(tenant.id, id);
  }

  // ============================================
  // VARIANTES
  // ============================================

  @Post(':productoId/variantes')
  @ApiOperation({ summary: 'Crear variante de producto' })
  async createVariante(
    @CurrentTenant() tenant: any,
    @Param('productoId') productoId: string,
    @Body()
    data: {
      talla?: string;
      color?: string;
      colorHex?: string;
      sku?: string;
      precio?: number;
      stock?: number;
    },
  ) {
    return this.productosService.createVariante(tenant.id, productoId, data);
  }

  @Post(':productoId/variantes/batch')
  @ApiOperation({ summary: 'Crear múltiples variantes' })
  async createVariantes(
    @CurrentTenant() tenant: any,
    @Param('productoId') productoId: string,
    @Body()
    variantes: Array<{
      talla?: string;
      color?: string;
      colorHex?: string;
      sku?: string;
      precio?: number;
      stock?: number;
    }>,
  ) {
    return this.productosService.createVariantes(tenant.id, productoId, variantes);
  }

  @Get(':productoId/variantes')
  @ApiOperation({ summary: 'Obtener variantes de un producto' })
  async getVariantes(
    @CurrentTenant() tenant: any,
    @Param('productoId') productoId: string,
  ) {
    return this.productosService.getVariantes(tenant.id, productoId);
  }

  @Put(':productoId/variantes/:varianteId')
  @ApiOperation({ summary: 'Actualizar variante' })
  async updateVariante(
    @CurrentTenant() tenant: any,
    @Param('productoId') productoId: string,
    @Param('varianteId') varianteId: string,
    @Body()
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
    return this.productosService.updateVariante(tenant.id, productoId, varianteId, data);
  }

  @Delete(':productoId/variantes/:varianteId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar variante (soft delete)' })
  async deleteVariante(
    @CurrentTenant() tenant: any,
    @Param('productoId') productoId: string,
    @Param('varianteId') varianteId: string,
  ) {
    return this.productosService.deleteVariante(tenant.id, productoId, varianteId);
  }
}
