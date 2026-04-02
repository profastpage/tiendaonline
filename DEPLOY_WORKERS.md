# 🚀 Deploy en Cloudflare Workers

## ¿Por qué Workers y no Pages?

Según la documentación oficial de Cloudflare (2024-2026):

- ✅ **Pages está en mantenimiento** - Sin nuevas features
- ✅ **Workers es el futuro** - Todas las innovaciones van aquí
- ✅ **Multi-tenant nativo** - Wildcard routes para subdominios dinámicos
- ✅ **Workers for Platforms** - Herramienta específica para SaaS
- ✅ **Durable Objects** - Estado en tiempo real por tenant
- ✅ **Full-stack unificado** - Assets + SSR en el mismo proyecto

## 📋 Prerrequisitos

1. Cuenta de Cloudflare
2. Node.js 18+
3. Wrangler CLI instalado

## 🔧 Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Autenticar con Cloudflare

```bash
npx wrangler login
```

### 3. Configurar wrangler.toml

Edita `apps/frontend/wrangler.toml`:

```toml
name = "tu-proyecto"
compatibility_date = "2024-01-01"

[vars]
NEXT_PUBLIC_API_URL = "https://api.tudominio.com"
NEXT_PUBLIC_APP_URL = "https://tu-proyecto.workers.dev"

# Para multi-tenant con wildcard
routes = [
  { pattern = "*.tudominio.com/*", zone_name = "tudominio.com" }
]
```

### 4. Crear KV Namespace (opcional)

```bash
npx wrangler kv:namespace create TIENDA_KV
```

### 5. Configurar D1 Database (opcional)

```bash
npx wrangler d1 create tiendas-db
npx wrangler d1 execute tiendas-db --file=prisma/schema.sql
```

## 🚀 Deploy

### Desarrollo local

```bash
cd apps/frontend
npm run dev
```

Accede a: http://localhost:8787

### Deploy a producción

```bash
cd apps/frontend
npm run deploy
```

## 🌐 Multi-Tenant con Wildcard Routes

### 1. Configurar DNS Wildcard

En Cloudflare DNS, agrega:

```
Type: A
Name: *
Content: [Tu IP de Workers]
Proxy: Enabled
```

### 2. Configurar Routes en wrangler.toml

```toml
routes = [
  { pattern = "*.tudominio.com/*", zone_name = "tudominio.com" }
]
```

### 3. Detectar tenant en el código

```typescript
// En tu middleware o layout
const hostname = new URL(request.url).hostname
const tenant = hostname.split('.')[0] // 'tenant1' de 'tenant1.tudominio.com'
```

## 📊 100 Subdominios Gratis

Cloudflare Workers incluye:

- ✅ **100,000 requests/día** gratis
- ✅ **Subdominios ilimitados** con wildcard
- ✅ **Deployments ilimitados**
- ✅ **SSL automático** en todos los subdominios
- ✅ **CDN global** incluido

## 🔐 Variables de Entorno

### En Cloudflare Dashboard

1. Ve a Workers & Pages → tu-proyecto
2. Settings → Variables → Environment Variables
3. Agrega:

```
NEXT_PUBLIC_API_URL = https://api.tudominio.com
DATABASE_URL = postgresql://...
JWT_SECRET = tu-secreto
```

### Usando Secrets (para datos sensibles)

```bash
npx wrangler secret put JWT_SECRET
npx wrangler secret put DATABASE_URL
```

##  Arquitectura Recomendada

```
┌─────────────────────────────────────────┐
│   Cloudflare Workers                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Next.js SSR (tu app)           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Middleware Multi-tenant        │   │
│  │  - Detecta subdominio           │   │
│  │  - Identifica tenant            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  KV Cache                       │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│  Backend API (otro Worker o     │
│  servidor externo)              │
└─────────────────────────────────┘
```

## 📈 Monitoreo

### Analytics

```bash
npx wrangler tail
```

### Logs en tiempo real

```bash
npx wrangler tail --format pretty
```

## 🔄 CI/CD con GitHub Actions

El deploy automático ya está configurado en `.github/workflows/deploy-pages.yml`

Solo necesitas agregar los secrets en GitHub:

```
CLOUDFLARE_API_TOKEN = tu_api_token
CLOUDFLARE_ACCOUNT_ID = tu_account_id
```

## 💰 Costos

### Plan Free (Gratis)

- 100,000 requests/día
- 10ms CPU time por request
- Subdominios ilimitidos
- SSL incluido

### Plan Bundled ($5/mes)

- 10 millones de requests/mes
- Mayor CPU time
- Priority support

### Pay-as-you-go

- $0.30 por millón de requests adicional
- $0.01 por GB-hour de memoria

## 🎯 Próximos Pasos

1. ✅ Deploy inicial del frontend
2. ⏳ Configurar backend API (otro Worker o externo)
3. ⏳ Configurar D1 o PostgreSQL externo
4. ⏳ Implementar Durable Objects para estado por tenant
5. ⏳ Configurar Workers for Platforms (SaaS avanzado)

## 📚 Recursos

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Workers for Platforms](https://developers.cloudflare.com/workers-for-platforms/)
- [Durable Objects](https://developers.cloudflare.com/durable-objects/)

---

**¡Listo para deploy en Cloudflare Workers!** 🚀
