'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Pedido, EstadoPedido } from '@/types';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import { Eye, MessageCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

const estados: EstadoPedido[] = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREPARACION',
  'LISTO',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
];

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPedidos();
  }, [filtroEstado]);

  const loadPedidos = async () => {
    try {
      const params = filtroEstado ? `?estado=${filtroEstado}` : '';
      const data = await apiClient.get<Pedido[]>(`/pedidos${params}`);
      setPedidos(data);
    } catch (error) {
      toast.error('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActualizarEstado = async (id: string, nuevoEstado: EstadoPedido) => {
    try {
      await apiClient.put(`/pedidos/${id}/estado`, { estado: nuevoEstado });
      toast.success('Estado actualizado');
      loadPedidos();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleGenerarWhatsApp = async (pedido: Pedido) => {
    try {
      const response: any = await apiClient.post(`/pedidos/${pedido.id}/whatsapp`);
      
      // Abrir WhatsApp en nueva pestaña
      if (response && response.whatsappLink) {
        window.open(response.whatsappLink, '_blank');
        toast.success('WhatsApp generado');
      }
    } catch (error) {
      toast.error('Error al generar WhatsApp');
    }
  };

  const getEstadoColor = (estado: EstadoPedido) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'warning';
      case 'CONFIRMADO':
      case 'EN_PREPARACION':
        return 'info';
      case 'LISTO':
      case 'ENVIADO':
        return 'success';
      case 'ENTREGADO':
        return 'success';
      case 'CANCELADO':
        return 'danger';
      default:
        return 'default';
    }
  };

  const filteredPedidos = filtroEstado
    ? pedidos.filter((p) => p.estado === filtroEstado)
    : pedidos;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600">Gestiona los pedidos de tu tienda</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroEstado('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !filtroEstado
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>

        {estados.map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filtroEstado === estado
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {estado.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPedidos.map((pedido) => (
            <Card key={pedido.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{pedido.numeroPedido}</h3>
                      <Badge variant={getEstadoColor(pedido.estado)}>
                        {pedido.estado.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Cliente</p>
                        <p className="font-medium">{pedido.clienteNombre}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Teléfono</p>
                        <p className="font-medium">{pedido.clienteTelefono}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-bold text-primary-600">
                          {formatPrice(pedido.total, 'PEN')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fecha</p>
                        <p className="font-medium">
                          {new Date(pedido.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Items del pedido */}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">Productos:</p>
                      <div className="flex flex-wrap gap-2">
                        {pedido.items.map((item) => (
                          <span
                            key={item.id}
                            className="text-sm bg-gray-100 px-2 py-1 rounded"
                          >
                            {item.cantidad}x {item.producto?.nombre}
                            {item.variante?.talla && ` (${item.variante.talla})`}
                          </span>
                        ))}
                      </div>
                    </div>

                    {pedido.notas && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Notas:</strong> {pedido.notas}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 ml-4">
                    <select
                      value={pedido.estado}
                      onChange={(e) =>
                        handleActualizarEstado(pedido.id, e.target.value as EstadoPedido)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado.replace('_', ' ')}
                        </option>
                      ))}
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerarWhatsApp(pedido)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/admin/pedidos/${pedido.id}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPedidos.length === 0 && (
            <p className="text-center py-12 text-gray-500">
              No hay pedidos en este estado
            </p>
          )}
        </div>
      )}
    </div>
  );
}
