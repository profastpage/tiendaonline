# 🚀 Tiendas Multi-Tenant - Plataforma SaaS Profesional

## Descripción

Plataforma SaaS multi-tenant diseñada para negocios que quieren vender por WhatsApp de manera profesional.

**URL:** http://localhost:4000

## ✨ Características Principales

### Para el Cliente Final
- 🛍️ **Catálogo Profesional** - Diseño moderno y responsive
- 🔍 **Búsqueda y Filtros** - Encuentra productos fácilmente
- 🛒 **Carrito de Compras** - Gestión intuitiva de pedidos
- 📱 **Checkout por WhatsApp** - Pedido listo para enviar
- 📄 **Página de Producto** - Información detallada con variantes

### Para el Administrador
- 📊 **Dashboard Analytics** - Métricas de ventas en tiempo real
- 📦 **Gestión de Productos** - CRUD completo con variantes
- 📈 **Control de Inventario** - Stock por variante
- 📋 **Gestión de Pedidos** - Estados y seguimiento
- 🔐 **Autenticación Segura** - JWT con roles

## 🎨 Diseño Profesional

### Tema Oscuro Moderno
- Fondo: Gradientes gris oscuro (#0a0a0a → #111827)
- Acentos: Verde esmeralda (#10b981 → #059669)
- Texto: Blanco y gris claro para contraste óptimo

### Componentes Premium
- Tarjetas con efectos hover
- Gradientes y sombras sutiles
- Animaciones fluidas
- Totalmente responsive

## 🏃 Inicio Rápido

### 1. Instalar Dependencias

```bash
cd "C:\dev\PROYECTOS ONLINE\DEMOS\TIENDAS MULTITENANT"
npm install
```

### 2. Configurar Base de Datos (Opcional para Demo)

```bash
cd apps\backend
npm run db:generate
# npm run db:migrate  # Si tienes PostgreSQL
```

### 3. Iniciar Aplicación

```bash
# Desde la raíz
npm run dev

# O por separado:
# Backend:
cd apps\backend && npm run dev

# Frontend:
cd apps\frontend && npm run dev
```

### 4. Acceder

- **Frontend:** http://localhost:4000
- **Backend:** http://localhost:3001
- **Swagger:** http://localhost:3001/api/docs

## 📁 Estructura del Proyecto

```
TIENDAS MULTITENANT/
├── apps/
│   ├── backend/              # API NestJS
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/     # Autenticación JWT
│   │   │   │   ├── tenants/  # Multi-tenant
│   │   │   │   ├── productos/# Productos y variantes
│   │   │   │   ├── pedidos/  # Pedidos + WhatsApp
│   │   │   │   └── inventario/# Control de stock
│   │   │   └── prisma/
│   │   └── prisma/schema.prisma
│   │
│   └── frontend/             # Next.js 14
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx  # Landing page
│       │   │   ├── catalogo/ # Catálogo
│       │   │   ├── productos/[slug]/ # Detalle
│       │   │   ├── carrito/  # Checkout
│       │   │   └── admin/    # Dashboard
│       │   ├── components/
│       │   │   ├── ui/       # Componentes base
│       │   │   ├── catalogo/ # ProductoCard, etc.
│       │   │   └── admin/    # Sidebar, Navbar
│       │   ├── hooks/        # Custom hooks
│       │   ├── stores/       # Zustand (auth, carrito)
│       │   ├── lib/          # Utils, API, mock-data
│       │   └── types/        # TypeScript types
│       └── public/
│
└── docs/                     # Documentación
```

## 🗄️ Modelos de Datos

### Tenant (Negocio)
```typescript
{
  id: string
  nombre: string
  slug: string           // Para subdominio
  whatsappNumero: string
  moneda: string
  activo: boolean
}
```

### Producto
```typescript
{
  id: string
  nombre: string
  slug: string
  precio: number
  precioOferta?: number
  destacado: boolean
  variantes: Variante[]
}
```

### Variante
```typescript
{
  id: string
  talla?: string
  color?: string
  colorHex?: string
  stock: number
  precio?: number
}
```

### Pedido
```typescript
{
  id: string
  numeroPedido: string   // PED-0001
  estado: EstadoPedido
  clienteNombre: string
  clienteTelefono: string
  total: number
  items: PedidoItem[]
  whatsappLink: string   // Link generado
}
```

## 🔌 API Endpoints

### Autenticación
```
POST   /auth/login       - Iniciar sesión
POST   /auth/register    - Registrar usuario
POST   /auth/change-password
```

### Productos
```
GET    /productos                 - Listar productos
GET    /productos/:id             - Obtener producto
GET    /productos/slug/:slug      - Por slug
POST   /productos                 - Crear producto
PUT    /productos/:id             - Actualizar
DELETE /productos/:id             - Eliminar
POST   /productos/:id/variantes   - Crear variante
```

### Pedidos
```
GET    /pedidos              - Listar pedidos
POST   /pedidos              - Crear pedido
GET    /pedidos/:id          - Obtener pedido
PUT    /pedidos/:id/estado   - Actualizar estado
POST   /pedidos/:id/whatsapp - Generar WhatsApp link
```

### Inventario
```
GET    /inventario                    - Stock actual
GET    /inventario/stats              - Estadísticas
POST   /inventario/movimientos        - Registrar movimiento
POST   /inventario/variantes/:id/ajustar
```

## 🎯 Flujo de Venta

```
1. Cliente visita http://localhost:4000
   ↓
2. Explora catálogo y filtra productos
   ↓
3. Ve detalle de producto y selecciona variante
   ↓
4. Agrega al carrito
   ↓
5. Va a /carrito y completa formulario
   ↓
6. Sistema crea pedido en backend
   ↓
7. Genera link de WhatsApp con mensaje formateado
   ↓
8. Cliente envía pedido por WhatsApp
   ↓
9. Admin recibe pedido y gestiona desde dashboard
```

## 📱 Ejemplo de Mensaje WhatsApp

```
👋 ¡Hola Urban Style!

📦 Nuevo Pedido #PED-0001

👤 Cliente: Juan Pérez
📱 Teléfono: +51 999 999 999

🛍️ Productos:

1. Polera Oversize Black
   Talla: M | Color: Negro
   2 x S/ 79.90 = S/ 159.80

2. Jean Slim Fit Dark
   Talla: 32
   1 x S/ 149.90 = S/ 149.90

━━━━━━━━━━━━━━━━━━━━━━
💰 TOTAL: S/ 309.70

📝 Notas: Entregar después de las 3pm

_Generado automáticamente por la tienda online_
```

## 🔐 Datos de Demo (Seed)

El sistema incluye datos de ejemplo:

### Tenant Demo
- **Nombre:** Urban Style
- **Slug:** urban-style (por defecto)
- **WhatsApp:** +51 999 999 999

### Productos Incluidos
- 6 productos con variantes
- 3 categorías (Poleras, Pantalones, Accesorios)
- Precios en PEN (Soles)

### Admin (cuando DB esté configurada)
- Email: admin@urbanstyle.com
- Password: admin123

## 🛠️ Tecnologías

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Estilos
- **Zustand** - Estado global
- **Lucide Icons** - Iconos
- **Sonner** - Notificaciones toast

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación API

## 🎨 Personalización

### Cambiar Colores
Editar `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#tu-color',  // Color principal
    600: '#tu-color-hover',
  }
}
```

### Cambiar Tenant por Defecto
Editar `apps/frontend/.env`:

```env
NEXT_PUBLIC_DEFAULT_TENANT=tu-tenant
```

## 📊 Métricas y Analytics

El dashboard incluye:
- Total de productos activos
- Pedidos totales y por estado
- Ventas totales en moneda local
- Ticket promedio
- Pedidos recientes
- Productos con stock bajo

## 🚀 Deploy a Producción

### Frontend (Vercel)
```bash
cd apps/frontend
npm run build
# Conectar repo a Vercel
```

### Backend (Railway/Render)
```bash
cd apps/backend
npm run build
# Configurar DATABASE_URL
# Deploy
```

### Base de Datos
- PostgreSQL en Railway, Supabase, o Neon
- Ejecutar migraciones automáticamente

## 🤖 Integración Futura con IA

El sistema está preparado para:
- 🎤 Transcripción de audio de WhatsApp
- 📝 Interpretación de pedidos por texto
- 💬 Chatbot automático
- 📧 Respuestas automáticas

Ver `IA_INTEGRACION.md` para detalles.

## 📞 Soporte

Para asistencia:
1. Revisa `README.md` para documentación completa
2. Revisa `INICIO_RAPIDO.md` para guía paso a paso
3. Revisa `ARQUITECTURA.md` para diagramas

---

**Desarrollado con ❤️ para emprendedores digitales**

*Versión: 1.0.0 | 2024*
