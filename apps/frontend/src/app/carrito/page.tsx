'use client';

import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { CarritoItems, CheckoutForm } from '@/components/carrito';
import { useTenant } from '@/hooks/useTenant';
import { useCarritoStore } from '@/stores/carrito-store';
import { ShoppingBag } from 'lucide-react';

export default function CarritoPage() {
  const { tenantSlug } = useTenant();
  const isEmpty = useCarritoStore((state) => state.isEmpty());

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar tenantName="Carrito" tenantSlug={tenantSlug || undefined} />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Tu Carrito de Compras
          </h1>

          {isEmpty ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-500 mb-6">
                Agrega productos para comenzar tu compra
              </p>
              <a
                href="/catalogo"
                className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Ver Catálogo
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items del carrito */}
              <div className="lg:col-span-2">
                <CarritoItems />
              </div>

              {/* Formulario de checkout */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Finalizar Pedido
                  </h2>
                  <CheckoutForm />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer tenantName="Carrito" />
    </div>
  );
}
