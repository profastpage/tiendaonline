'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ProductoList } from '@/components/catalogo';
import { mockProductos } from '@/lib/mock-data';
import { ArrowRight, Truck, CreditCard, MessageCircle, CheckCircle2, Store, Smartphone, Percent } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui';

export default function HomePage() {
  // Usar datos mock directamente sin useEffect
  const productos = mockProductos;
  const productosDestacados = productos.filter((p) => p.destacado).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar tenantName="Urban Style" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 via-gray-900 to-purple-600/20"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Convierte visitas en pedidos de WhatsApp
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Tu tienda online lista en minutos. Sin comisiones por venta. 
                Gestión completa de productos y pedidos directamente en tu WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/catalogo">
                  <Button
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                  >
                    Ver Catálogo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/carrito">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600/10"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Pedir por WhatsApp
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Características */}
        <section className="py-16 px-4 bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="bg-green-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Tienda Online</h3>
                <p className="text-gray-400 text-sm">
                  Catálogo profesional con variantes de productos
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">Pedidos WhatsApp</h3>
                <p className="text-gray-400 text-sm">
                  Los pedidos llegan directamente a tu WhatsApp
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-purple-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Percent className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">0% Comisiones</h3>
                <p className="text-gray-400 text-sm">
                  Sin comisiones por venta. Todo tuyo.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="bg-orange-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Móvil</h3>
                <p className="text-gray-400 text-sm">
                  Optimizado para celulares y tablets
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Por qué elegirnos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Activo en minutos</h3>
                  <p className="text-gray-400 text-sm">
                    Configura tu tienda y comienza a vender en menos de 10 minutos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Sin comisiones por venta</h3>
                  <p className="text-gray-400 text-sm">
                    Una cuota fija mensual. Todo lo que vendas es tuyo
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Pago y activa ahora</h3>
                  <p className="text-gray-400 text-sm">
                    Sin esperas. Tu tienda activa inmediatamente después del pago
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Gestión de inventario</h3>
                  <p className="text-gray-400 text-sm">
                    Control total de stock por variante de producto
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Pedidos automáticos</h3>
                  <p className="text-gray-400 text-sm">
                    Los pedidos se generan automáticamente con todos los detalles
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold mb-2">Soporte 24/7</h3>
                  <p className="text-gray-400 text-sm">
                    Estamos aquí para ayudarte en cualquier momento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Productos Destacados */}
        <section className="py-16 px-4 bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Productos Destacados
            </h2>
            <p className="text-gray-400 text-center mb-12">
              Explora lo mejor de nuestro catálogo
            </p>

            <ProductoList
              productos={productosDestacados}
              emptyMessage="No hay productos destacados aún"
            />

            {productosDestacados.length > 0 && (
              <div className="text-center mt-8">
                <Link href="/catalogo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-green-600 text-green-400 hover:bg-green-600/10"
                  >
                    Ver todos los productos
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Estadísticas */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">+120</div>
                <p className="text-gray-400">Negocios activos</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                <p className="text-gray-400">Siempre vendiendo</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">0%</div>
                <p className="text-gray-400">Comisión por venta</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 px-4 bg-gradient-to-r from-green-600/20 to-emerald-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para digitalizar tu negocio?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Únete a más de 120 negocios que ya están vendiendo más con nuestra plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalogo">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white border-0"
                >
                  Comenzar ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Área de clientes
                </Button>
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-6">
              Planes desde S/29 al mes • Sin comisiones por venta
            </p>
          </div>
        </section>
      </main>

      <Footer tenantName="Urban Style" />
    </div>
  );
}
