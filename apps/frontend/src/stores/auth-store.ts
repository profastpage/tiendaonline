import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario, Tenant, LoginDto, RegisterDto } from '@/types';
import { apiClient } from '@/lib/api';

interface AuthState {
  user: Usuario | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  setTenant: (tenant: Tenant | null) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tenant: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: async (data: LoginDto) => {
        try {
          const response = await apiClient.post<{
            user: Usuario;
            access_token: string;
          }>('/auth/login', data);

          const { user, access_token } = response;

          localStorage.setItem('token', access_token);
          localStorage.setItem('user', JSON.stringify(user));

          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterDto) => {
        await apiClient.post('/auth/register', data);
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({
          user: null,
          tenant: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setTenant: (tenant: Tenant | null) => {
        set({ tenant });
        if (tenant) {
          localStorage.setItem('tenantSlug', tenant.slug);
        } else {
          localStorage.removeItem('tenantSlug');
        }
      },

      checkAuth: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr) as Usuario;
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
