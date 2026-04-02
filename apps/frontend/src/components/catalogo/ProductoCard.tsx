'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Producto } from '@/types';
import { Card, CardContent, Badge } from '@/components/ui';
import { ShoppingBag, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductoCardProps {
  producto: Producto;
  tenantSlug?: string;
}

export function ProductoCard({ producto, tenantSlug }: ProductoCardProps) {
  const tieneOferta = producto.precioOferta && producto.precioOferta < producto.precio;
  const tieneVariantes = (producto._count?.variantes || 0) > 0;
  const descuento = tieneOferta 
    ? Math.round((1 - producto.precioOferta! / producto.precio) * 100) 
    : 0;

  return (
    <Card variant="outlined" className="group bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden">
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden bg-gray-700/50">
        {producto.imagenPrincipal ? (
          <Image
            src={producto.imagenPrincipal}
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-700 to-gray-800">
            <div className="text-center p-4">
              <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Sin imagen</p>
            </div>
          </div>
        )}

        {/* Badge de oferta */}
        {tieneOferta && (
          <Badge
            variant="danger"
            size="sm"
            className="absolute top-3 left-3 bg-red-500 hover:bg-red-600"
          >
            -{descuento}%
          </Badge>
        )}

        {/* Badge de destacado */}
        {producto.destacado && !tieneOferta && (
          <Badge
            variant="info"
            size="sm"
            className="absolute top-3 left-3 bg-blue-500 hover:bg-blue-600"
          >
            Destacado
          </Badge>
        )}

        {/* Overlay con botón ver */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/productos/${producto.slug}`}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-green-500 hover:text-white"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Ver Producto
            </div>
          </Link>
        </div>
      </div>

      {/* Información del producto */}
      <CardContent className="p-4">
        <Link href={`/productos/${producto.slug}`}>
          <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors line-clamp-2 min-h-[3rem]">
            {producto.nombre}
          </h3>
        </Link>

        {producto.descripcion && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2 min-h-[2.5rem]">
            {producto.descripcion}
          </p>
        )}

        {/* Precio */}
        <div className="mt-4">
          {tieneOferta && producto.precioOferta ? (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-green-400">
                {formatPrice(producto.precioOferta, 'PEN')}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(producto.precio, 'PEN')}
              </span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-white">
              {formatPrice(producto.precio, 'PEN')}
            </span>
          )}
        </div>

        {/* Badge de variantes */}
        {tieneVariantes && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <Badge variant="default" size="sm" className="bg-gray-700 text-gray-300">
              {producto._count?.variantes} variantes
            </Badge>
            {producto.variantes && producto.variantes.length > 0 && (
              <div className="flex gap-1">
                {producto.variantes.slice(0, 3).map((v, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: v.colorHex || v.color || '#6b7280' }}
                    title={`${v.talla || ''} ${v.color || ''}`.trim()}
                  />
                ))}
                {producto.variantes.length > 3 && (
                  <span className="text-xs text-gray-500">+{producto.variantes.length - 3}</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botón agregar al carrito */}
        <Link
          href={`/productos/${producto.slug}`}
          className="mt-4 block w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg shadow-green-600/20"
        >
          Ver Detalles
        </Link>
      </CardContent>
    </Card>
  );
}
