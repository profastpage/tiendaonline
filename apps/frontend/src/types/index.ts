// Tipos compartidos para la aplicación

export interface Tenant {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  logoUrl?: string;
  bannerUrl?: string;
  whatsappNumero: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  moneda: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Usuario {
  id: string;
  tenantId: string;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'GERENTE' | 'VENDEDOR';
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  tenant?: Tenant;
}

export interface Categoria {
  id: string;
  tenantId: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  imagenUrl?: string;
  orden: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    productos: number;
  };
  productos?: Producto[];
}

export interface Producto {
  id: string;
  tenantId: string;
  categoriaId?: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  precio: number;
  precioOferta?: number;
  imagenPrincipal?: string;
  activo: boolean;
  destacado: boolean;
  createdAt: string;
  updatedAt: string;
  categoria?: Categoria;
  variantes?: Variante[];
  _count?: {
    variantes: number;
  };
}

export interface Variante {
  id: string;
  productoId: string;
  talla?: string;
  color?: string;
  colorHex?: string;
  sku?: string;
  precio?: number;
  stock: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  producto?: Producto;
}

export interface Inventario {
  id: string;
  varianteId: string;
  tipoMovimiento: 'COMPRA' | 'VENTA' | 'DEVOLUCION' | 'AJUSTE' | 'MERMA';
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  motivo?: string;
  usuarioId?: string;
  createdAt: string;
  variante?: Variante & {
    producto: Producto;
  };
}

export interface Pedido {
  id: string;
  tenantId: string;
  usuarioId?: string;
  numeroPedido: string;
  estado: EstadoPedido;
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  subtotal: number;
  descuento: number;
  total: number;
  whatsappEnviado: boolean;
  whatsappMensaje?: string;
  notas?: string;
  notasInternas?: string;
  createdAt: string;
  updatedAt: string;
  items: PedidoItem[];
  whatsappLink?: string;
}

export type EstadoPedido =
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'LISTO'
  | 'ENVIADO'
  | 'ENTREGADO'
  | 'CANCELADO';

export interface PedidoItem {
  id: string;
  pedidoId: string;
  productoId: string;
  varianteId?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  createdAt: string;
  producto?: Producto;
  variante?: Variante;
}

export interface CarritoItem {
  productoId: string;
  varianteId?: string;
  cantidad: number;
  producto: Producto;
  variante?: Variante;
}

export interface LoginDto {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  nombre: string;
  tenantSlug: string;
}

export interface CreatePedidoDto {
  clienteNombre: string;
  clienteTelefono: string;
  clienteEmail?: string;
  notas?: string;
  items: Array<{
    productoId: string;
    varianteId?: string;
    cantidad: number;
  }>;
}
