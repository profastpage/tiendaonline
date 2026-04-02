import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService, LoginDto, RegisterDto } from './auth.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario en un tenant' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado o tenant no encontrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body() loginDto: LoginDto,
    @Body('tenantSlug') tenantSlug?: string,
  ) {
    return this.authService.login(loginDto, tenantSlug);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Cambiar password del usuario actual' })
  @ApiResponse({ status: 200, description: 'Password actualizado' })
  @ApiResponse({ status: 401, description: 'Password actual inválido' })
  async changePassword(
    @CurrentUser() user: any,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.changePassword(user.id, currentPassword, newPassword);
  }
}
