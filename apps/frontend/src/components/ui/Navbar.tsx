'use client';

import Link from 'next/link';
import { useCarritoStore } from '@/stores/carrito-store';
import { ShoppingBag, User, Menu, X, Home } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  tenantName?: string;
  tenantSlug?: string;
}

export function Navbar({ tenantName, tenantSlug }: NavbarProps) {
  const itemCount = useCarritoStore((state) => state.getItemCount());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Nombre del tenant */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {tenantName || 'Tienda'}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Pedidos por WhatsApp
              </p>
            </div>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Catálogo
            </Link>
            <Link
              href="/nosotros"
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              Nosotros
            </Link>
          </div>

          {/* Acciones */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <Link href="/carrito" className="relative">
              <div className="p-2 text-gray-300 hover:text-green-400 transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Login */}
            <Link href="/login">
              <div className="p-2 text-gray-300 hover:text-green-400 transition-colors">
                <User className="w-6 h-6" />
              </div>
            </Link>

            {/* Menú móvil */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-green-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              href="/nosotros"
              className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/carrito"
              className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Carrito ({itemCount})
            </Link>
            <Link
              href="/login"
              className="block py-2 text-gray-300 hover:text-green-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
