'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para detectar el tenant actual basado en el subdominio o ruta
 */
export function useTenant() {
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // En cliente, detectar tenant de diferentes formas
    const detectTenant = () => {
      // 1. Intentar obtener del hostname (subdominio)
      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      let slug: string | null = null;

      // Si hay subdominio (ej: tenant.localhost o tenant.dominio.com)
      if (
        parts.length > 1 &&
        parts[0] !== 'localhost' &&
        parts[0] !== 'www' &&
        parts[0] !== ''
      ) {
        slug = parts[0];
      }

      // 2. Si no hay subdominio, usar tenant por defecto de env
      if (!slug) {
        slug = process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'urban-style';
      }

      setTenantSlug(slug);
      setIsLoading(false);
    };

    detectTenant();
  }, []);

  return { tenantSlug, isLoading };
}

/**
 * Hook para obtener información del tenant desde la API
 */
export function useTenantInfo(tenantSlug: string | null) {
  const [tenant, setTenant] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tenantSlug) {
      setIsLoading(false);
      return;
    }

    const fetchTenant = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tenants/slug/${tenantSlug}`
        );

        if (!response.ok) {
          throw new Error('Tenant no encontrado');
        }

        const data = await response.json();
        setTenant(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setTenant(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [tenantSlug]);

  return { tenant, isLoading, error };
}
