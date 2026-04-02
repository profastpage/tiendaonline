'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCarritoStore } from '@/stores/carrito-store';
import { useTenant } from '@/hooks/useTenant';
import { apiClient } from '@/lib/api';
import { Button, Input } from '@/components/ui';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface CheckoutFormData {
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  notas?: string;
}

export function CheckoutForm() {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const { items, clearCart, getTotal } = useCarritoStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const onSubmit = async (data: CheckoutFormData) => {
    if (!tenantSlug) {
      toast.error('No se pudo identificar la tienda');
      return;
    }

    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setIsLoading(true);

    try {
      // Preparar items para la API
      const itemsParaPedido = items.map((item) => ({
        productoId: item.productoId,
        varianteId: item.varianteId,
        cantidad: item.cantidad,
      }));

      // Crear pedido
      const pedido: any = await apiClient.post('/pedidos', {
        ...data,
        items: itemsParaPedido,
      });

      // Limpiar carrito
      clearCart();

      toast.success('¡Pedido creado exitosamente!');

      // Redirigir a página de confirmación con link a WhatsApp
      router.push(`/pedido-confirmado/${pedido.id}`);
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      toast.error(
        error.response?.data?.message || 'Error al crear el pedido'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nombre completo"
        placeholder="Juan Pérez"
        error={errors.clienteNombre?.message}
        {...register('clienteNombre', {
          required: 'El nombre es requerido',
          minLength: {
            value: 3,
            message: 'El nombre debe tener al menos 3 caracteres',
          },
        })}
      />

      <Input
        label="Teléfono / WhatsApp"
        placeholder="+51 999 999 999"
        error={errors.clienteTelefono?.message}
        {...register('clienteTelefono', {
          required: 'El teléfono es requerido',
          pattern: {
            value: /^[0-9+\-\s()]+$/,
            message: 'Ingresa un teléfono válido',
          },
        })}
      />

      <Input
        label="Email (opcional)"
        type="email"
        placeholder="juan@email.com"
        error={errors.clienteEmail?.message}
        {...register('clienteEmail', {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Ingresa un email válido',
          },
        })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas del pedido (opcional)
        </label>
        <textarea
          {...register('notas')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Ej: Entregar después de las 3pm, timbre no funciona, etc."
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isLoading}
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Enviar pedido por WhatsApp
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al hacer clic, se generará tu pedido y se abrirá WhatsApp para enviarlo
        a la tienda.
      </p>
    </form>
  );
}
