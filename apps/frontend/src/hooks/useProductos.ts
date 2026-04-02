'use client';

import { useEffect, useState } from 'react';
import { Producto, Categoria } from '@/types';
import { apiClient } from '@/lib/api';
import { mockProductos, mockCategorias } from '@/lib/mock-data';

interface UseProductosResult {
  productos: Producto[];
  categorias: Categoria[];
  isLoading: boolean;
  error: Error | null;
  loadProductos: (filtros?: any) => Promise<void>;
  loadCategorias: () => Promise<void>;
}

/**
 * Hook para manejar productos y categorías del catálogo
 * Usa datos mock cuando la API no está disponible
 */
export function useProductos(): UseProductosResult {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProductos = async (filtros?: any) => {
    try {
      setIsLoading(true);
      
      // Usar datos mock directamente para desarrollo
      console.log('Usando datos mock para productos');
      let filtered = mockProductos;

      if (filtros?.categoriaId) {
        filtered = filtered.filter(p => p.categoriaId === filtros.categoriaId);
      }
      if (filtros?.destacado) {
        filtered = filtered.filter(p => p.destacado);
      }
      if (filtros?.search) {
        const search = filtros.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.nombre.toLowerCase().includes(search) ||
          p.descripcion?.toLowerCase().includes(search)
        );
      }

      setProductos(filtered);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategorias = async () => {
    // Usar datos mock directamente
    setCategorias(mockCategorias);
  };

  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  return {
    productos,
    categorias,
    isLoading,
    error,
    loadProductos,
    loadCategorias,
  };
}
