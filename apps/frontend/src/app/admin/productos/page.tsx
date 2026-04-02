'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Producto, Categoria } from '@/types';
import { Button, Input, Badge, Card, CardContent } from '@/components/ui';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await apiClient.get<Producto[]>('/productos?activo=true');
      setProductos(data);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const data = await apiClient.get<Categoria[]>('/productos/categorias');
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await apiClient.delete(`/productos/${id}`);
      toast.success('Producto eliminado');
      loadProductos();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.post(`/productos/${id}/toggle-status`);
      toast.success(currentStatus ? 'Producto desactivado' : 'Producto activado');
      loadProductos();
    } catch (error) {
      toast.error('Error al actualizar producto');
    }
  };

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">Gestiona tu catálogo de productos</p>
        </div>

        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Formulario de nuevo producto (simplificado) */}
      {showForm && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600">
              Formulario de producto - (Implementación completa pendiente)
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>

      {/* Lista de productos */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Producto
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Categoría
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Precio
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Estado
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((producto) => (
                <tr key={producto.id} className="border-t border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{producto.nombre}</p>
                      <p className="text-sm text-gray-500">{producto.slug}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {producto.categoria?.nombre || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold">{formatPrice(producto.precio, 'PEN')}</p>
                      {producto.precioOferta && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(producto.precio, 'PEN')}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {producto._count?.variantes || 0} variantes
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={producto.activo ? 'success' : 'default'}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => window.open(`/productos/${producto.slug}`, '_blank')}
                        className="p-2 text-gray-600 hover:text-primary-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(producto.id, producto.activo)}
                        className="p-2 text-gray-600 hover:text-orange-600"
                      >
                        {producto.activo ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="p-2 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProductos.length === 0 && (
            <p className="text-center py-8 text-gray-500">
              No se encontraron productos
            </p>
          )}
        </div>
      )}
    </div>
  );
}
