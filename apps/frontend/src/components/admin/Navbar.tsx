'use client';

import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';

export function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button className="lg:hidden mr-4">
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            Panel de Administración
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Usuario */}
          <div className="hidden md:flex items-center text-sm text-gray-600">
            <span>{user?.nombre}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
