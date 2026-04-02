'use client';

import Image from 'next/image';
import { useCarritoStore } from '@/stores/carrito-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CarritoItems() {
  const { items, updateQuantity, removeItem, getTotal } = useCarritoStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
        <Link href="/catalogo">
          <Button className="mt-4">Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const precio =
          item.variante?.precio ||
          item.producto.precioOferta ||
          item.producto.precio;

        return (
          <div
            key={`${item.productoId}-${item.varianteId || 'sin-variante'}`}
            className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200"
          >
            {/* Imagen */}
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
              {item.producto.imagenPrincipal ? (
                <Image
                  src={item.producto.imagenPrincipal}
                  alt={item.producto.nombre}
                  fill
                  className="object-cover rounded"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
              )}
            </div>

            {/* Información */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {item.producto.nombre}
              </h3>

              {(item.variante?.talla || item.variante?.color) && (
                <p className="text-sm text-gray-500">
                  {[item.variante?.talla, item.variante?.color]
                    .filter(Boolean)
                    .join(' - ')}
                </p>
              )}

              <p className="text-primary-600 font-bold mt-1">
                {formatPrice(precio, 'PEN')}
              </p>
            </div>

            {/* Controles */}
            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() =>
                  removeItem(item.productoId, item.varianteId)
                }
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productoId,
                      item.varianteId,
                      item.cantidad - 1
                    )
                  }
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-medium">
                  {item.cantidad}
                </span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.productoId,
                      item.varianteId,
                      item.cantidad + 1
                    )
                  }
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm font-semibold text-gray-700">
                Subtotal: {formatPrice(precio * item.cantidad, 'PEN')}
              </p>
            </div>
          </div>
        );
      })}

      {/* Total */}
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-primary-600">
            {formatPrice(getTotal(), 'PEN')}
          </span>
        </div>
      </div>
    </div>
  );
}
