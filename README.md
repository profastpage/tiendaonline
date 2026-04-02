# 🛒 Tiendas Multi-Tenant - Plataforma SaaS para Ventas por WhatsApp

Plataforma multi-tenant diseñada para negocios de productos físicos (ropa, accesorios, etc.) que quieran gestionar sus ventas a través de WhatsApp.

## 📋 Características Principales

### Multi-Tenant
- Cada negocio (tenant) tiene su propio subdominio
- Aislamiento completo de datos por tenant
- Configuración personalizada por tienda

### Para el Admin de cada Tienda
- ✅ CRUD de productos con variantes (talla, color)
- ✅ Gestión de inventario por variante
- ✅ Dashboard con estadísticas de ventas
- ✅ Gestión de pedidos con estados
- ✅ Generación automática de mensajes de WhatsApp

### Para el Cliente Final
- ✅ Catálogo de productos por tienda
- ✅ Carrito de compras
- ✅ Checkout simplificado
- ✅ Pedido enviado directamente por WhatsApp

## 🏗️ Arquitectura

### Backend
- **Framework:** NestJS
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Autenticación:** JWT
- **Documentación:** Swagger

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** TailwindCSS
- **Estado:** Zustand
- **UI Components:** Personalizados

## 📁 Estructura del Proyecto

```
tiendas-multitenant/
├── apps/
│   ├── backend/              # API NestJS
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/     # Autenticación
│   │   │   │   ├── tenants/  # Gestión de tenants
│   │   │   │   ├── productos/ # Productos, categorías, variantes
│   │   │   │   ├── pedidos/  # Pedidos y WhatsApp
│   │   │   │   └── inventario/ # Control de inventario
│   │   │   ├── common/
│   │   │   │   ├── guards/   # Guards (Auth, Tenant, Roles)
│   │   │   │   └── decorators/
│   │   │   └── prisma/
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   │
│   └── frontend/             # Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── admin/    # Dashboard admin
│       │   │   ├── catalogo/ # Catálogo público
│       │   │   ├── carrito/  # Carrito y checkout
│       │   │   └── login/    # Login admin
│       │   ├── components/
│       │   │   ├── ui/       # Componentes base
│       │   │   ├── catalogo/
│       │   │   ├── carrito/
│       │   │   └── admin/
│       │   ├── hooks/
│       │   ├── stores/       # Zustand stores
│       │   ├── lib/          # Utilidades y API client
│       │   └── types/
│       └── public/
│
├── packages/                 # Paquetes compartidos
└── package.json              # Root package (workspaces)
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- PostgreSQL 14+
- npm o pnpm

### 1. Instalar dependencias

```bash
# En la raíz del proyecto
npm install

# O con pnpm
pnpm install
```

### 2. Configurar variables de entorno

#### Backend (.env en apps/backend/)
```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tiendas_multitenant?schema=public"
JWT_SECRET="tu-secreto-super-seguro"
JWT_EXPIRATION="7d"
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
WHATSAPP_DEFAULT_COUNTRY_CODE=51
```

#### Frontend (.env en apps/frontend/)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_TENANT=moda-urbana
```

### 3. Configurar base de datos

```bash
cd apps/backend

# Generar Prisma Client
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Seed de datos de ejemplo
npm run db:seed
```

### 4. Iniciar aplicación

```bash
# Desde la raíz del proyecto
npm run dev

# Esto iniciará:
# - Backend en http://localhost:3001
# - Frontend en http://localhost:3000
```

## 📚 Endpoints de la API

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Login
- `POST /auth/change-password` - Cambiar contraseña

### Tenants
- `GET /tenants` - Listar tenants activos
- `GET /tenants/slug/:slug` - Obtener tenant por slug
- `GET /tenants/:id` - Obtener tenant por ID
- `GET /tenants/:id/stats` - Estadísticas del tenant

### Productos
- `GET /productos/categorias` - Listar categorías
- `POST /productos/categorias` - Crear categoría
- `GET /productos` - Listar productos (con filtros)
- `POST /productos` - Crear producto
- `GET /productos/:id` - Obtener producto
- `PUT /productos/:id` - Actualizar producto
- `DELETE /productos/:id` - Eliminar producto
- `POST /productos/:id/variantes` - Crear variante
- `POST /productos/:id/variantes/batch` - Crear múltiples variantes

### Pedidos
- `GET /pedidos` - Listar pedidos
- `POST /pedidos` - Crear pedido
- `GET /pedidos/:id` - Obtener pedido
- `PUT /pedidos/:id/estado` - Actualizar estado
- `POST /pedidos/:id/whatsapp` - Generar link de WhatsApp

### Inventario
- `GET /inventario` - Obtener inventario actual
- `GET /inventario/stats` - Estadísticas de inventario
- `GET /inventario/movimientos` - Historial de movimientos
- `POST /inventario/movimientos` - Registrar movimiento
- `POST /inventario/variantes/:id/ajustar` - Ajustar stock

## 🗄️ Modelos de Base de Datos

### Tenant
- Negocio/tienda principal
- Slug único para subdominio
- Configuración (logo, whatsapp, moneda, etc.)

### Usuario
- Admin del tenant
- Roles: ADMIN, GERENTE, VENDEDOR
- Autenticación con JWT

### Producto
- Nombre, slug, descripción
- Precio y precio de oferta
- Categoría opcional
- Activo/inactivo

### Variante
- Talla, color, colorHex
- SKU único
- Stock individual
- Precio opcional (si difiere del producto)

### Pedido
- Número único por tenant
- Estados: PENDIENTE, CONFIRMADO, EN_PREPARACION, LISTO, ENVIADO, ENTREGADO, CANCELADO
- Items del pedido
- Integración con WhatsApp

### Inventario
- Histórico de movimientos
- Tipos: COMPRA, VENTA, DEVOLUCION, AJUSTE, MERMA
- Control de stock por variante

## 🔐 Autenticación

La API usa JWT para autenticación:

1. Login devuelve `access_token`
2. Incluir token en header: `Authorization: Bearer <token>`
3. El tenant se identifica por:
   - Subdominio (producción)
   - Header `X-Tenant-Slug` (desarrollo)
   - Parámetro en ruta

## 📱 Integración con WhatsApp

### Generación de Link
```typescript
https://wa.me/{numero}?text={mensaje_encoded}
```

### Mensaje Automático
El sistema genera un mensaje formateado con:
- Nombre del cliente
- Lista de productos
- Variantes (talla, color)
- Cantidades y precios
- Total del pedido
- Notas adicionales

## 🎯 Flujo de Pedido

1. Cliente browsea el catálogo
2. Agrega productos al carrito
3. Completa formulario de checkout
4. Sistema crea pedido en estado PENDIENTE
5. Se genera link de WhatsApp con el pedido
6. Cliente envía pedido por WhatsApp
7. Admin gestiona pedido desde dashboard
8. Admin actualiza estados del pedido

## 🤖 Preparado para IA

El sistema incluye el modelo `IaAudit` para futuras integraciones:

- **Procesamiento de voz a texto** (audios de WhatsApp)
- **Interpretación de pedidos por texto natural**
- **Chatbot automático para clientes**

### Ejemplo de uso futuro:
```typescript
// Audio de WhatsApp → Texto → Pedido
const transcription = await qwen.audioToText(audioBuffer);
const pedido = await qwen.interpretarPedido(transcription);
await pedidosService.create(pedido);
```

## 🧪 Datos de Ejemplo

El seed crea 2 tenants:

### Moda Urbana
- Slug: `moda-urbana`
- Email: `admin@modaurbana.com`
- Password: `admin123`
- Productos: Poleras, pantalones con variantes

### Accesorios Plus
- Slug: `accesorios-plus`
- Email: `admin@accesoriosplus.com`
- Password: `admin123`
- Productos: Bolsos con variantes de color

## 📊 Dashboard

El dashboard admin incluye:
- Estadísticas de ventas
- Pedidos recientes
- Control de inventario
- Productos más vendidos
- Gráficas de rendimiento

## 🔧 Desarrollo

### Comandos útiles

```bash
# Backend
cd apps/backend
npm run dev          # Desarrollo con watch
npm run build        # Build de producción
npm run db:generate  # Generar Prisma Client
npm run db:migrate   # Migraciones
npm run db:studio    # Prisma Studio (GUI)

# Frontend
cd apps/frontend
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run lint         # ESLint
```

## 📦 Producción

### Backend
```bash
cd apps/backend
npm run build
npm run start
```

### Frontend
```bash
cd apps/frontend
npm run build
npm run start
```

### Subdominios Multi-Tenant

Configurar DNS wildcard:
```
*.tudominio.com → IP del servidor
```

Configurar reverse proxy (Nginx):
```nginx
server {
    listen 80;
    server_name *.tudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

## 📝 Licencia

MIT

## 👥 Soporte

Para soporte técnico o consultas:
- Documentación API: http://localhost:3001/api/docs
- Issues: GitHub Issues

---

**Construido con ❤️ para emprendedores**
