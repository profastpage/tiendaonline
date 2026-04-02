'use client';

import { Categoria } from '@/types';
import { cn } from '@/lib/utils';

interface CategoriaFilterProps {
  categorias: Categoria[];
  categoriaSeleccionada?: string | null;
  onSelectCategoria: (categoriaId: string | null) => void;
}

export function CategoriaFilter({
  categorias,
  categoriaSeleccionada,
  onSelectCategoria,
}: CategoriaFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Todos */}
      <button
        onClick={() => onSelectCategoria(null)}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          categoriaSeleccionada === null
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        Todos
      </button>

      {/* Categorías */}
      {categorias.map((categoria) => (
        <button
          key={categoria.id}
          onClick={() => onSelectCategoria(categoria.id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            categoriaSeleccionada === categoria.id
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {categoria.nombre}
        </button>
      ))}
    </div>
  );
}
