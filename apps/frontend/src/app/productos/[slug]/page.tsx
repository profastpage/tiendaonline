'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button, Badge } from '@/components/ui';
import { useProductos } from '@/hooks/useProductos';
import { useCarritoStore } from '@/stores/carrito-store';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Check, Minus, Plus, ArrowLeft, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProductoPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { productos, isLoading } = useProductos();
  const { addItem } = useCarritoStore();
  
  const producto = productos.find(p => p.slug === slug);
  
  const [cantidad, setCantidad] = useState(1);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<string | null>(null);

  if (!isLoading && !producto) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h1>
            <p className="text-gray-400 mb-4">El producto que buscas no existe</p>
            <Link href="/catalogo">
              <Button className="bg-green-600 hover:bg-green-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al catálogo
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!producto) return null;

  const varianteSeleccionadaData = producto.variantes?.find(v => v.id === varianteSeleccionada);
  const precioFinal = varianteSeleccionadaData?.precio || producto.precioOferta || producto.precio;
  const stockDisponible = varianteSeleccionadaData?.stock || producto.variantes?.reduce((sum, v) => sum + v.stock, 0) || 0;

  const handleAgregarCarrito = () => {
    if (producto.variantes && producto.variantes.length > 0 && !varianteSeleccionada) {
      toast.warning('Selecciona una variante');
      return;
    }

    addItem(producto, varianteSeleccionadaData, cantidad);
    toast.success('Producto agregado al carrito');
  };

  const tieneStock = stockDisponible > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar tenantName="Producto" />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/catalogo"
              className="inline-flex items-center text-gray-400 hover:text-green-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Imagen */}
            <div className="aspect-square bg-gray-800 rounded-2xl overflow-hidden">
              {producto.imagenPrincipal ? (
                <img
                  src={producto.imagenPrincipal}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                  <div className="text-center">
                    <ShoppingBag className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Sin imagen disponible</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información */}
            <div className="space-y-6">
              {/* Título y badges */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {producto.destacado && (
                    <Badge variant="info" size="sm">Destacado</Badge>
                  )}
                  {producto.precioOferta && (
                    <Badge variant="danger" size="sm">
                      -{Math.round((1 - producto.precioOferta! / producto.precio) * 100)}% OFF
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {producto.nombre}
                </h1>
                {producto.categoria && (
                  <p className="text-gray-400">{producto.categoria.nombre}</p>
                )}
              </div>

              {/* Precio */}
              <div className="border-y border-gray-700 py-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-green-400">
                    {formatPrice(precioFinal, 'PEN')}
                  </span>
                  {producto.precioOferta && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(producto.precio, 'PEN')}
                    </span>
                  )}
                </div>
                {tieneStock ? (
                  <p className="text-green-400 mt-2 flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Disponible ({stockDisponible} en stock)
                  </p>
                ) : (
                  <p className="text-red-400 mt-2">Agotado</p>
                )}
              </div>

              {/* Descripción */}
              {producto.descripcion && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Descripción</h3>
                  <p className="text-gray-400">{producto.descripcion}</p>
                </div>
              )}

              {/* Variantes */}
              {producto.variantes && producto.variantes.length > 0 && (
                <div className="space-y-4">
                  {/* Tallas */}
                  {producto.variantes.some(v => v.talla) && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Talla</h3>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(producto.variantes.map(v => v.talla).filter(Boolean))).map((talla) => {
                          const variantesConTalla = producto.variantes!.filter(v => v.talla === talla);
                          const tieneStockTalla = variantesConTalla.some(v => v.stock > 0);
                          const varianteId = variantesConTalla.find(v => v.stock > 0)?.id;

                          return (
                            <button
                              key={talla}
                              onClick={() => varianteId && setVarianteSeleccionada(varianteId)}
                              disabled={!tieneStockTalla}
                              className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                varianteSeleccionada === varianteId
                                  ? 'bg-green-600 text-white'
                                  : tieneStockTalla
                                  ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                                  : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                              }`}
                            >
                              {talla}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Colores */}
                  {producto.variantes.some(v => v.color) && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
                      <div className="flex flex-wrap gap-3">
                        {Array.from(new Set(producto.variantes.map(v => `${v.color}-${v.colorHex}`))).map((colorKey) => {
                          const [colorName, colorHex] = colorKey.split('-');
                          const variantesConColor = producto.variantes!.filter(v => v.color === colorName);
                          const tieneStockColor = variantesConColor.some(v => v.stock > 0);
                          const varianteId = variantesConColor.find(v => v.stock > 0)?.id;

                          return (
                            <button
                              key={colorKey}
                              onClick={() => varianteId && setVarianteSeleccionada(varianteId)}
                              disabled={!tieneStockColor}
                              className={`w-12 h-12 rounded-full border-2 transition-all ${
                                varianteSeleccionada === varianteId
                                  ? 'border-green-500 scale-110'
                                  : tieneStockColor
                                  ? 'border-gray-600 hover:border-gray-400'
                                  : 'border-gray-700 opacity-50 cursor-not-allowed'
                              }`}
                              style={{ backgroundColor: colorHex || '#6b7280' }}
                              title={colorName}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cantidad */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Cantidad</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-white w-16 text-center">{cantidad}</span>
                  <button
                    onClick={() => setCantidad(cantidad + 1)}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button
                  onClick={handleAgregarCarrito}
                  disabled={!tieneStock}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-6 h-6 mr-3" />
                  {tieneStock ? 'Agregar al Carrito' : 'Agotado'}
                </Button>

                <a
                  href={`https://wa.me/51999999999?text=Hola, me interesa el producto ${producto.nombre}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Consultar por WhatsApp
                </a>
              </div>

              {/* Información de envío */}
              <div className="border-t border-gray-700 pt-6 space-y-3">
                <div className="flex items-start gap-3 text-gray-400">
                  <Truck className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Envíos a todo el país</p>
                    <p className="text-sm">Entrega en 24-48 horas hábiles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-gray-400">
                  <RotateCcw className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold">Cambios y devoluciones</p>
                    <p className="text-sm">Hasta 7 días después de la compra</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
