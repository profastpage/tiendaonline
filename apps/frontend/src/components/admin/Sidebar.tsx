'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ClipboardList,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/productos', icon: Package, label: 'Productos' },
  { href: '/admin/inventario', icon: ShoppingBag, label: 'Inventario' },
  { href: '/admin/pedidos', icon: ClipboardList, label: 'Pedidos' },
  { href: '/admin/clientes', icon: Users, label: 'Clientes' },
  { href: '/admin/configuracion', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">Panel Admin</h1>
        <p className="text-xs text-gray-400 mt-1">Gestión de tienda</p>
      </div>

      {/* Menú */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center font-bold">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.nombre}</p>
            <p className="text-xs text-gray-400">{user?.rol}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
