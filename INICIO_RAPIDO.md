# 🚀 Guía de Inicio Rápido

## Paso 1: Instalar Dependencias

```bash
cd "C:\dev\PROYECTOS ONLINE\DEMOS\TIENDAS MULTITENANT"

# Instalar en todo el monorepo
npm install
```

## Paso 2: Configurar Base de Datos

Asegúrate de tener PostgreSQL corriendo. Luego:

```bash
cd apps\backend

# El archivo .env ya está configurado, si necesitas cambiar la conexión:
# Edita apps\backend\.env con tus credenciales de PostgreSQL

# Generar Prisma Client
npm run db:generate

# Ejecutar migraciones (crea las tablas)
npm run db:migrate

# Cargar datos de ejemplo (2 tiendas con productos)
npm run db:seed
```

## Paso 3: Iniciar Aplicación

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000
- **Swagger (API Docs)**: http://localhost:3001/api/docs

## Paso 4: Probar la Aplicación

### Tiendas Creadas (Seed)

#### Moda Urbana
- URL: http://localhost:3000 (o http://moda-urbana.localhost:3000)
- Admin: `admin@modaurbana.com`
- Password: `admin123`

#### Accesorios Plus
- URL: http://localhost:3000 (o http://accesorios-plus.localhost:3000)
- Admin: `admin@accesoriosplus.com`
- Password: `admin123`

### Flujo Recomendado

1. **Explora el catálogo público**
   - Ve a http://localhost:3000
   - Navega por los productos
   - Agrega items al carrito

2. **Realiza un pedido de prueba**
   - Ve al carrito: http://localhost:3000/carrito
   - Completa el formulario
   - Envía el pedido por WhatsApp

3. **Gestiona desde el admin**
   - Login: http://localhost:3000/login
   - Dashboard: http://localhost:3000/admin
   - Ve a Pedidos para ver el pedido creado
   - Genera el link de WhatsApp

## Comandos Útiles

### Backend
```bash
cd apps\backend

# Desarrollo
npm run dev

# Build producción
npm run build
npm run start

# Base de datos
npm run db:generate    # Generar Prisma Client
npm run db:migrate     # Migraciones
npm run db:studio      # GUI de Prisma
npm run db:seed        # Datos de ejemplo
```

### Frontend
```bash
cd apps\frontend

# Desarrollo
npm run dev

# Build producción
npm run build
npm run start

# Linting
npm run lint
```

## Solución de Problemas

### Error: "Cannot find module '@prisma/client'"
```bash
cd apps\backend
npm run db:generate
```

### Error: "Database connection failed"
Verifica que PostgreSQL esté corriendo y que las credenciales en `apps\backend\.env` sean correctas.

### Error: "Port already in use"
Cambia el puerto en los archivos `.env`:
- Backend: `PORT=3001` → `PORT=3002`
- Frontend: El puerto 3000 es default de Next.js

### Frontend no se conecta al backend
Verifica que `NEXT_PUBLIC_API_URL` en `apps\frontend\.env` apunte a la URL correcta del backend.

## Estructura de Carpetas

```
TIENDAS MULTITENANT/
├── apps/
│   ├── backend/          # API NestJS
│   │   ├── src/
│   │   │   ├── modules/  # Módulos de la API
│   │   │   ├── common/   # Guards, decorators
│   │   │   └── prisma/   # Servicio de DB
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── frontend/         # Next.js
│       ├── src/
│       │   ├── app/      # Páginas
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── stores/   # Estado (Zustand)
│       │   └── lib/      # Utilidades
│       └── public/
│
└── README.md
```

## Próximos Pasos

1. **Personaliza tu tienda**
   - Edita los datos del tenant en la DB
   - Sube tu logo y banner
   - Configura tu número de WhatsApp

2. **Agrega tus productos**
   - Usa el dashboard admin
   - Crea categorías
   - Agrega productos con variantes

3. **Configura para producción**
   - Deploy en Vercel (frontend)
   - Deploy en Railway/Render (backend + DB)
   - Configura subdominios wildcard

## Soporte

- API Docs: http://localhost:3001/api/docs
- Prisma Studio: `npm run db:studio`

---

¡Listo! Ya puedes comenzar a usar tu plataforma multi-tenant 🎉
