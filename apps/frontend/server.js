import { handle } from 'next-on-pages'

// Handler principal para Cloudflare Workers
export const onRequest = handle

// Configuración para multi-tenant
export const config = {
  runtime: 'edge',
  regions: ['auto'],
}
