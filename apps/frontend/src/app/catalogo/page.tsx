'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ProductoList, CategoriaFilter } from '@/components/catalogo';
import { mockProductos, mockCategorias } from '@/lib/mock-data';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui';

export default function CatalogoPage() {
  const [productos] = useState(mockProductos);
  const [categorias] = useState(mockCategorias);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProductos = productos.filter((p) => {
    const matchCategoria = !categoriaSeleccionada || p.categoriaId === categoriaSeleccionada;
    const matchSearch = !searchTerm || 
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });

  const hasActiveFilters = categoriaSeleccionada || searchTerm;

  const clearFilters = () => {
    setCategoriaSeleccionada(null);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar tenantName="Catálogo" />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Nuestro Catálogo
            </h1>
            <p className="text-gray-400">
              Explora todos nuestros productos
            </p>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              {/* Buscador */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>

              {/* Toggle filtros */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-green-400 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Filtros de categorías */}
            {showFilters && (
              <div className="animate-fade-in">
                <CategoriaFilter
                  categorias={categorias}
                  categoriaSeleccionada={categoriaSeleccionada}
                  onSelectCategoria={setCategoriaSeleccionada}
                />
              </div>
            )}

            {/* Filtros activos */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">Filtros:</span>
                {categoriaSeleccionada && (
                  <button
                    onClick={() => setCategoriaSeleccionada(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm hover:bg-green-600/30 transition-colors"
                  >
                    {categorias.find(c => c.id === categoriaSeleccionada)?.nombre}
                    <X className="w-3 h-3" />
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm hover:bg-green-600/30 transition-colors"
                  >
                    &quot;{searchTerm}&quot;
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Limpiar todo
                </button>
              </div>
            )}
          </div>

          {/* Contador de productos */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-400 text-sm">
              {filteredProductos.length} productos encontrados
            </p>
          </div>

          {/* Lista de productos */}
          <ProductoList
            productos={filteredProductos}
            emptyMessage={
              hasActiveFilters
                ? 'No hay productos que coincidan con tu búsqueda'
                : 'No hay productos disponibles'
            }
          />
        </div>
      </main>

      <Footer tenantName="Catálogo" />
    </div>
  );
}
