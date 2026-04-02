'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Variante, Producto } from '@/types';
import { Button, Input, Badge, Card, CardContent } from '@/components/ui';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { toast } from 'sonner';

interface InventarioItem extends Variante {
  producto: Producto;
}

export default function AdminInventarioPage() {
  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'sin-stock' | 'stock-bajo'>('todos');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventario();
  }, [filtro]);

  const loadInventario = async () => {
    try {
      let params = '';
      if (filtro === 'sin-stock') params = '?sinStock=true';
      else if (filtro === 'stock-bajo') params = '?stockMinimo=5';

      const data = await apiClient.get<InventarioItem[]>(`/inventario${params}`);
      setInventario(data);
    } catch (error) {
      toast.error('Error al cargar inventario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAjustarStock = async (varianteId: string, nuevoStock: number) => {
    try {
      await apiClient.post(`/inventario/variantes/${varianteId}/ajustar`, {
        nuevoStock,
        motivo: 'Ajuste manual desde admin',
      });
      toast.success('Stock actualizado');
      loadInventario();
    } catch (error) {
      toast.error('Error al actualizar stock');
    }
  };

  const sinStockCount = inventario.filter((i) => i.stock === 0).length;
  const stockBajoCount = inventario.filter((i) => i.stock > 0 && i.stock <= 5).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
        <p className="text-gray-600">Control de stock de productos y variantes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Variantes</p>
              <p className="text-2xl font-bold">{inventario.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sin Stock</p>
              <p className="text-2xl font-bold text-red-600">{sinStockCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-yellow-600">{stockBajoCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtro === 'todos'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos ({inventario.length})
        </button>

        <button
          onClick={() => setFiltro('sin-stock')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtro === 'sin-stock'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Sin Stock ({sinStockCount})
        </button>

        <button
          onClick={() => setFiltro('stock-bajo')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filtro === 'stock-bajo'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Stock Bajo ({stockBajoCount})
        </button>
      </div>

      {/* Tabla de inventario */}
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
                  Variante
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  SKU
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
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
              {inventario.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {item.talla && (
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          Talla: {item.talla}
                        </span>
                      )}
                      {item.color && (
                        <div className="flex items-center gap-1">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.colorHex || item.color }}
                          />
                          <span className="text-sm text-gray-600">{item.color}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {item.sku || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-bold ${
                      item.stock === 0
                        ? 'text-red-600'
                        : item.stock <= 5
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        item.stock === 0
                          ? 'danger'
                          : item.stock <= 5
                          ? 'warning'
                          : 'success'
                      }
                    >
                      {item.stock === 0
                        ? 'Sin Stock'
                        : item.stock <= 5
                        ? 'Stock Bajo'
                        : 'En Stock'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Nuevo stock"
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        onBlur={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            handleAjustarStock(item.id, value);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAjustarStock(item.id, item.stock + 1)
                        }
                      >
                        +1
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {inventario.length === 0 && (
            <p className="text-center py-8 text-gray-500">
              No hay productos en esta categoría
            </p>
          )}
        </div>
      )}
    </div>
  );
}
