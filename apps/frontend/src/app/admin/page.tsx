'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card, CardContent, Badge } from '@/components/ui';
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  totalProductos: number;
  productosActivos: number;
  totalPedidos: number;
  totalVentas: number;
}

interface PedidoReciente {
  id: string;
  numeroPedido: string;
  clienteNombre: string;
  total: number;
  estado: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pedidosRecientes, setPedidosRecientes] = useState<PedidoReciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsData, pedidosData] = await Promise.all([
          apiClient.get<DashboardStats>('/tenants/1/stats'),
          apiClient.get<PedidoReciente[]>('/pedidos?limit=5'),
        ]);

        setStats(statsData);
        setPedidosRecientes(pedidosData);
      } catch (error: any) {
        console.error('Error cargando dashboard:', error);
        setStats(null);
        setPedidosRecientes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu tienda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Productos Activos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.productosActivos || 0}
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pedidos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalPedidos || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ventas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(stats?.totalVentas || 0, 'PEN')}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Promedio</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(
                    stats?.totalPedidos
                      ? (stats?.totalVentas || 0) / stats.totalPedidos
                      : 0,
                    'PEN'
                  )}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos Recientes */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Pedidos Recientes
          </h2>

          {pedidosRecientes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay pedidos recientes
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Pedido
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Cliente
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosRecientes.map((pedido) => (
                    <tr key={pedido.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm font-medium">
                        {pedido.numeroPedido}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {pedido.clienteNombre}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            pedido.estado === 'PENDIENTE'
                              ? 'warning'
                              : pedido.estado === 'CANCELADO'
                              ? 'danger'
                              : pedido.estado === 'ENTREGADO'
                              ? 'success'
                              : 'info'
                          }
                        >
                          {pedido.estado}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        {formatPrice(pedido.total, 'PEN')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(pedido.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
