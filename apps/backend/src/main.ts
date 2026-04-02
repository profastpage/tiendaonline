import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para el frontend
  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000'],
    credentials: true,
  });

  // Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API - Tiendas Multi-Tenant')
    .setDescription('API para plataforma de ventas por WhatsApp')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('tenants', 'Gestión de tenants/negocios')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('productos', 'Gestión de productos')
    .addTag('categorias', 'Gestión de categorías')
    .addTag('variantes', 'Gestión de variantes')
    .addTag('inventario', 'Control de inventario')
    .addTag('pedidos', 'Gestión de pedidos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3001;

  await app.listen(port);
  console.log(`🚀 Backend corriendo en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();
