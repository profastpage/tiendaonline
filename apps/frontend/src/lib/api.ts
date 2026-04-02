import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Agregar header de tenant si está disponible
    const tenantSlug = localStorage.getItem('tenantSlug');
    if (tenantSlug && !config.url?.startsWith('/tenants')) {
      config.headers['X-Tenant-Slug'] = tenantSlug;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos
export interface ApiResponse<T> {
  data: T;
  status: number;
}

// Funciones helper para peticiones
export const apiClient = {
  // GET
  async get<T>(url: string, config?: any) {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  // POST
  async post<T>(url: string, data?: any, config?: any) {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  // PUT
  async put<T>(url: string, data?: any, config?: any) {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  // DELETE
  async delete<T>(url: string, config?: any) {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};
