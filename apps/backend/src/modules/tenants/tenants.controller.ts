import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService, CreateTenantDto, UpdateTenantDto } from './tenants.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo tenant/negocio' })
  @ApiResponse({ status: 201, description: 'Tenant creado exitosamente' })
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tenants activos' })
  async findAll() {
    return this.tenantsService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener tenant por slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tenant por ID con estadísticas' })
  async findById(@Param('id') id: string) {
    return this.tenantsService.findById(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Obtener estadísticas del tenant' })
  async getStats(@Param('id') id: string) {
    return this.tenantsService.getStats(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar tenant (solo ADMIN)' })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Post(':id/toggle-status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activar/desactivar tenant (solo ADMIN)' })
  async toggleStatus(@Param('id') id: string) {
    return this.tenantsService.toggleStatus(id);
  }
}
