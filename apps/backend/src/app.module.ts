import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { ProductosModule } from './modules/productos/productos.module';
import { PedidosModule } from './modules/pedidos/pedidos.module';
import { InventarioModule } from './modules/inventario/inventario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    TenantsModule,
    ProductosModule,
    PedidosModule,
    InventarioModule,
  ],
})
export class AppModule {}
