import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CarritoItem, Producto, Variante } from '@/types';

interface CarritoState {
  items: CarritoItem[];
  tenantId?: string;

  // Actions
  addItem: (producto: Producto, variante?: Variante, cantidad?: number) => void;
  removeItem: (productoId: string, varianteId?: string) => void;
  updateQuantity: (productoId: string, varianteId: string | undefined, cantidad: number) => void;
  clearCart: () => void;
  setTenantId: (tenantId: string) => void;

  // Selectors
  getItemCount: () => number;
  getTotal: () => number;
  isEmpty: () => boolean;
}

export const useCarritoStore = create<CarritoState>()(
  persist(
    (set, get) => ({
      items: [],
      tenantId: undefined,

      addItem: (producto, variante, cantidad = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productoId === producto.id &&
              item.varianteId === variante?.id
          );

          if (existingIndex > -1) {
            // Actualizar cantidad si ya existe
            const newItems = [...state.items];
            newItems[existingIndex].cantidad += cantidad;
            return { items: newItems };
          }

          // Agregar nuevo item
          return {
            items: [
              ...state.items,
              {
                productoId: producto.id,
                varianteId: variante?.id,
                cantidad,
                producto,
                variante,
              },
            ],
          };
        });
      },

      removeItem: (productoId: string, varianteId?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productoId === productoId &&
                item.varianteId === varianteId
              )
          ),
        }));
      },

      updateQuantity: (
        productoId: string,
        varianteId: string | undefined,
        cantidad: number
      ) => {
        if (cantidad <= 0) {
          get().removeItem(productoId, varianteId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.productoId === productoId && item.varianteId === varianteId
              ? { ...item, cantidad }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setTenantId: (tenantId: string) => {
        // Si cambia el tenant, limpiar carrito
        set({ tenantId, items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.cantidad, 0);
      },

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const precio =
            item.variante?.precio ||
            item.producto.precioOferta ||
            item.producto.precio;
          return total + precio * item.cantidad;
        }, 0);
      },

      isEmpty: () => {
        return get().items.length === 0;
      },
    }),
    {
      name: 'carrito-storage',
    }
  )
);
