# 📐 Arquitectura del Sistema

## Visión General

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTES                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Navegador  │  │   Móvil     │  │  WhatsApp   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Frontend   │
                    │   Next.js   │
                    │  :3000      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Backend   │
                    │   NestJS    │
                    │  :3001      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │   Prisma    │
                    └─────────────┘
```

## Multi-Tenant Architecture

### Estrategia de Identificación

```
┌──────────────────────────────────────────────────────────┐
│  Subdominio: {tenant}.midominio.com                      │
│  Header: X-Tenant-Slug                                   │
│  Ruta: /t/{tenant-slug}                                  │
└──────────────────────────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   TenantGuard         │
            │   - Extrae slug       │
            │   - Busca en DB       │
            │   - Adjunta al req    │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   Controllers         │
            │   - Usan req.tenant   │
            │   - Filtran por ID    │
            └───────────────────────┘
```

## Capas del Backend

```
┌─────────────────────────────────────────────────────────┐
│  Controller Layer                                        │
│  - HTTP endpoints                                        │
│  - Request/Response DTOs                                 │
│  - Swagger docs                                          │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Service Layer (Business Logic)                          │
│  - Reglas de negocio                                     │
│  - Validaciones                                          │
│  - Transacciones                                         │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Data Access Layer (Prisma)                              │
│  - Queries a DB                                          │
│  - Relaciones                                            │
│  - Transacciones                                         │
└─────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Cliente hace pedido desde la web

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Cliente │     │ Frontend │     │ Backend  │     │    DB    │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │  Agrega al     │                │                │
     │  carrito       │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │  Completa      │                │                │
     │  checkout      │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │  POST /pedidos │                │
     │                │───────────────>│                │
     │                │                │                │
     │                │                │  Validar       │
     │                │                │  tenant        │
     │                │                │───────────────>│
     │                │                │                │
     │                │                │  Crear pedido  │
     │                │                │  + items       │
     │                │                │───────────────>│
     │                │                │                │
     │                │                │  Actualizar    │
     │                │                │  inventario    │
     │                │                │───────────────>│
     │                │                │                │
     │                │  Pedido +      │                │
     │                │  WhatsApp Link │                │
     │                │<───────────────│                │
     │  Redirige a    │                │                │
     │  confirmación  │                │                │
     │<───────────────│                │                │
     │                │                │                │
     │  Abre WhatsApp │                │                │
     │  con pedido    │                │                │
     │                │                │                │
```

### 2. Admin gestiona pedido

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   Admin  │     │ Frontend │     │ Backend  │     │    DB    │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │  Login         │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │  POST /auth    │                │
     │                │───────────────>│                │
     │                │                │  Validar       │
     │                │                │  credenciales  │
     │                │                │───────────────>│
     │                │                │                │
     │                │  JWT Token     │                │
     │                │<───────────────│                │
     │  Dashboard     │                │                │
     │<───────────────│                │                │
     │                │                │                │
     │  Ver pedidos   │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │  GET /pedidos  │                │
     │                │  (con JWT)     │                │
     │                │───────────────>│                │
     │                │                │                │
     │                │                │  Listar        │
     │                │                │  pedidos       │
     │                │                │───────────────>│
     │                │                │                │
     │                │  Pedidos       │                │
     │                │<───────────────│                │
     │  Muestra       │                │                │
     │  lista         │                │                │
     │<───────────────│                │                │
     │                │                │                │
     │  Actualizar    │                │                │
     │  estado        │                │                │
     │───────────────>│                │                │
     │                │                │                │
     │                │  PUT /pedidos  │                │
     │                │  /:id/estado   │                │
     │                │───────────────>│                │
     │                │                │  Update        │
     │                │                │  estado        │
     │                │                │───────────────>│
     │                │  OK            │                │
     │                │<───────────────│                │
     │  Confirma      │                │                │
     │<───────────────│                │                │
```

## Seguridad

### Autenticación JWT

```
┌─────────────────────────────────────────────────────────┐
│  Login Request                                           │
│  POST /auth/login                                        │
│  { email, password, tenantSlug }                         │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   AuthService         │
            │   - Valida creds      │
            │   - Hash password     │
            │   - Genera JWT        │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   JWT Payload         │
            │   {                   │
            │     sub: userId       │
            │     email             │
            │     tenantId          │
            │     rol               │
            │   }                   │
            └───────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   Client Storage      │
            │   localStorage.token  │
            └───────────────────────┘
```

### Guards en Cascada

```
Request
  │
  ▼
┌─────────────────┐
│  TenantGuard    │  ← Identifica tenant
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthGuard      │  ← Valida JWT
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RolesGuard     │  ← Verifica permisos
└────────┬────────┘
         │
         ▼
    Controller
```

## Base de Datos

### Esquema Multi-Tenant

```
┌──────────────────────────────────────────────────────────┐
│  tenants                                                 │
│  ┌──────┬────────┬───────┬────────┬─────────────────┐  │
│  │ id   │ nombre │ slug  │ activo │ configuración   │  │
│  └──────┴────────┴───────┴────────┴─────────────────┘  │
│       │                                                 │
│       │ 1:N                                             │
│       ▼                                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  usuarios  │  productos  │  pedidos  │  ...     │  │
│  │  tenantId  │  tenantId   │  tenantId │          │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Aislamiento de Datos

Todas las queries incluyen `tenantId`:

```typescript
// ❌ MAL - sin filtro de tenant
const productos = await prisma.producto.findMany();

// ✅ BIEN - con filtro de tenant
const productos = await prisma.producto.findMany({
  where: { tenantId: request.tenant.id }
});
```

## Escalabilidad

### Horizontal

```
┌─────────────────────────────────────────────────────────┐
│  Load Balancer                                           │
└──────┬────────────────────────────────────┬─────────────┘
       │                                    │
       ▼                                    ▼
┌──────────────┐                    ┌──────────────┐
│  Instancia 1 │                    │  Instancia 2 │
│  Backend     │                    │  Backend     │
└──────┬───────┘                    └──────┬───────┘
       │                                    │
       └────────────────┬───────────────────┘
                        │
                        ▼
              ┌─────────────────┐
              │  PostgreSQL     │
              │  (conexiones    │
              │   pool)         │
              └─────────────────┘
```

### Caché

```
Request
  │
  ▼
┌─────────────────┐
│  Cache Layer    │  ← Redis (futuro)
└────────┬────────┘
         │
         │ Miss
         ▼
┌─────────────────┐
│  Business Logic │
└─────────────────┘
```

## Monitoreo

### Logs Estructurados

```typescript
// Cada request genera:
{
  timestamp: "2024-01-01T10:00:00Z",
  level: "INFO",
  tenant: "moda-urbana",
  user: "admin@modaurbana.com",
  action: "CREATE_PEDIDO",
  requestId: "abc-123",
  duration: 150 // ms
}
```

### Métricas

- Requests por segundo
- Tiempo de respuesta promedio
- Errores por tipo
- Pedidos por tenant
- Usuarios activos

---

**Arquitectura lista para escalar** 🚀
