/**
 * Seed de datos iniciales para desarrollo
 * Crea tenants de ejemplo con productos y variantes
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Hash para passwords de ejemplo
  const passwordHash = await bcrypt.hash('admin123', 10);

  // ============================================
  // TENANT 1: MODA URBANA
  // ============================================
  const tenantModa = await prisma.tenant.upsert({
    where: { slug: 'moda-urbana' },
    update: {},
    create: {
      nombre: 'Moda Urbana',
      slug: 'moda-urbana',
      descripcion: 'Ropa urbana y streetwear para jóvenes',
      whatsappNumero: '51999999999',
      email: 'contacto@modaurbana.com',
      direccion: 'Av. Larco 123, Miraflores',
      ciudad: 'Lima',
      pais: 'Perú',
      moneda: 'PEN',
    },
  });

  console.log(`✅ Tenant creado: ${tenantModa.nombre}`);

  // Admin del tenant
  await prisma.usuario.upsert({
    where: { tenantId_email: { tenantId: tenantModa.id, email: 'admin@modaurbana.com' } },
    update: {},
    create: {
      tenantId: tenantModa.id,
      email: 'admin@modaurbana.com',
      passwordHash,
      nombre: 'Admin Moda Urbana',
      rol: 'ADMIN',
    },
  });

  // Categorías
  const catPoleras = await prisma.categoria.upsert({
    where: { tenantId_slug: { tenantId: tenantModa.id, slug: 'poleras' } },
    update: {},
    create: {
      tenantId: tenantModa.id,
      nombre: 'Poleras',
      slug: 'poleras',
      descripcion: 'Poleras y camisetas urbanas',
      orden: 1,
    },
  });

  const catPantalones = await prisma.categoria.upsert({
    where: { tenantId_slug: { tenantId: tenantModa.id, slug: 'pantalones' } },
    update: {},
    create: {
      tenantId: tenantModa.id,
      nombre: 'Pantalones',
      slug: 'pantalones',
      descripcion: 'Pantalones jeans y joggers',
      orden: 2,
    },
  });

  console.log('✅ Categorías creadas');

  // Productos - Poleras
  const polera1 = await prisma.producto.create({
    data: {
      tenantId: tenantModa.id,
      categoriaId: catPoleras.id,
      nombre: 'Polera Oversize Black',
      slug: 'polera-oversize-black',
      descripcion: 'Polera oversize 100% algodón, corte urbano',
      precio: 89.90,
      imagenPrincipal: '/images/polera-black.jpg',
      destacado: true,
    },
  });

  // Variantes de polera
  await prisma.variante.createMany({
    data: [
      { productoId: polera1.id, talla: 'S', color: 'Negro', colorHex: '#000000', sku: 'PO-BLK-S', stock: 20 },
      { productoId: polera1.id, talla: 'M', color: 'Negro', colorHex: '#000000', sku: 'PO-BLK-M', stock: 25 },
      { productoId: polera1.id, talla: 'L', color: 'Negro', colorHex: '#000000', sku: 'PO-BLK-L', stock: 15 },
      { productoId: polera1.id, talla: 'XL', color: 'Negro', colorHex: '#000000', sku: 'PO-BLK-XL', stock: 10 },
    ],
  });

  const polera2 = await prisma.producto.create({
    data: {
      tenantId: tenantModa.id,
      categoriaId: catPoleras.id,
      nombre: 'Polera Graphic White',
      slug: 'polera-graphic-white',
      descripcion: 'Polera con estampado gráfico frontal',
      precio: 79.90,
      precioOferta: 69.90,
      imagenPrincipal: '/images/polera-white.jpg',
    },
  });

  await prisma.variante.createMany({
    data: [
      { productoId: polera2.id, talla: 'S', color: 'Blanco', colorHex: '#FFFFFF', sku: 'PG-WHT-S', stock: 15 },
      { productoId: polera2.id, talla: 'M', color: 'Blanco', colorHex: '#FFFFFF', sku: 'PG-WHT-M', stock: 20 },
      { productoId: polera2.id, talla: 'L', color: 'Blanco', colorHex: '#FFFFFF', sku: 'PG-WHT-L', stock: 18 },
    ],
  });

  // Productos - Pantalones
  const pantalon1 = await prisma.producto.create({
    data: {
      tenantId: tenantModa.id,
      categoriaId: catPantalones.id,
      nombre: 'Jean Slim Fit',
      slug: 'jean-slim-fit',
      descripcion: 'Jean slim fit stretch, lavado oscuro',
      precio: 149.90,
      imagenPrincipal: '/images/jean-slim.jpg',
      destacado: true,
    },
  });

  await prisma.variante.createMany({
    data: [
      { productoId: pantalon1.id, talla: '28', color: 'Azul Oscuro', colorHex: '#1a237e', sku: 'JN-SLM-28', stock: 12 },
      { productoId: pantalon1.id, talla: '30', color: 'Azul Oscuro', colorHex: '#1a237e', sku: 'JN-SLM-30', stock: 15 },
      { productoId: pantalon1.id, talla: '32', color: 'Azul Oscuro', colorHex: '#1a237e', sku: 'JN-SLM-32', stock: 18 },
      { productoId: pantalon1.id, talla: '34', color: 'Azul Oscuro', colorHex: '#1a237e', sku: 'JN-SLM-34', stock: 10 },
    ],
  });

  console.log('✅ Productos y variantes creados');

  // ============================================
  // TENANT 2: ACCESORIOS PLUS
  // ============================================
  const tenantAccesorios = await prisma.tenant.upsert({
    where: { slug: 'accesorios-plus' },
    update: {},
    create: {
      nombre: 'Accesorios Plus',
      slug: 'accesorios-plus',
      descripcion: 'Accesorios de moda y complementos',
      whatsappNumero: '51988888888',
      email: 'hola@accesoriosplus.com',
      direccion: 'Jr. de la Unión 456, Lima Centro',
      ciudad: 'Lima',
      pais: 'Perú',
      moneda: 'PEN',
    },
  });

  console.log(`✅ Tenant creado: ${tenantAccesorios.nombre}`);

  await prisma.usuario.upsert({
    where: { tenantId_email: { tenantId: tenantAccesorios.id, email: 'admin@accesoriosplus.com' } },
    update: {},
    create: {
      tenantId: tenantAccesorios.id,
      email: 'admin@accesoriosplus.com',
      passwordHash,
      nombre: 'Admin Accesorios Plus',
      rol: 'ADMIN',
    },
  });

  // Categoría
  const catBolsos = await prisma.categoria.upsert({
    where: { tenantId_slug: { tenantId: tenantAccesorios.id, slug: 'bolsos' } },
    update: {},
    create: {
      tenantId: tenantAccesorios.id,
      nombre: 'Bolsos',
      slug: 'bolsos',
      descripcion: 'Bolsos y carteras',
      orden: 1,
    },
  });

  // Producto
  const bolso1 = await prisma.producto.create({
    data: {
      tenantId: tenantAccesorios.id,
      categoriaId: catBolsos.id,
      nombre: 'Bolso Tote Canvas',
      slug: 'bolso-tote-canvas',
      descripcion: 'Bolso tote de canvas resistente, ideal para el día a día',
      precio: 59.90,
      imagenPrincipal: '/images/bolso-tote.jpg',
      destacado: true,
    },
  });

  await prisma.variante.createMany({
    data: [
      { productoId: bolso1.id, color: 'Beige', colorHex: '#f5f5dc', sku: 'BT-BGE-001', stock: 30 },
      { productoId: bolso1.id, color: 'Negro', colorHex: '#000000', sku: 'BT-BLK-001', stock: 25 },
      { productoId: bolso1.id, color: 'Verde Oliva', colorHex: '#556b2f', sku: 'BT-OLV-001', stock: 20 },
    ],
  });

  console.log('✅ Tenant Accesorios Plus configurado');

  // ============================================
  // PEDIDO DE EJEMPLO
  // ============================================
  const pedido = await prisma.pedido.create({
    data: {
      tenantId: tenantModa.id,
      numeroPedido: 'PED-0001',
      estado: 'PENDIENTE',
      clienteNombre: 'Juan Pérez',
      clienteTelefono: '51999888777',
      clienteEmail: 'juan@email.com',
      subtotal: 239.80,
      descuento: 0,
      total: 239.80,
      notas: 'Pedido desde la web',
      items: {
        create: [
          {
            productoId: polera1.id,
            varianteId: (await prisma.variante.findFirst({ where: { productoId: polera1.id, talla: 'M' } }))!.id,
            cantidad: 2,
            precioUnitario: 89.90,
            subtotal: 179.80,
          },
          {
            productoId: polera2.id,
            varianteId: (await prisma.variante.findFirst({ where: { productoId: polera2.id, talla: 'L' } }))!.id,
            cantidad: 1,
            precioUnitario: 69.90,
            subtotal: 69.90,
          },
        ],
      },
    },
  });

  console.log('✅ Pedido de ejemplo creado');

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📋 DATOS DE ACCESO:');
  console.log('   Tenant: Moda Urbana');
  console.log('   Email: admin@modaurbana.com');
  console.log('   Password: admin123');
  console.log('\n   Tenant: Accesorios Plus');
  console.log('   Email: admin@accesoriosplus.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
