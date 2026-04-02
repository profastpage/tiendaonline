'use client';

import { Producto } from '@/types';
import { ProductoCard } from './ProductoCard';

interface ProductoListProps {
  productos: Producto[];
  tenantSlug?: string;
  emptyMessage?: string;
}

export function ProductoList({
  productos,
  tenantSlug,
  emptyMessage = 'No hay productos disponibles',
}: ProductoListProps) {
  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((producto) => (
        <ProductoCard
          key={producto.id}
          producto={producto}
          tenantSlug={tenantSlug}
        />
      ))}
    </div>
  );
}
