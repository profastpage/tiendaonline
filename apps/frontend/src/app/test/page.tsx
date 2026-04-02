'use client';

import { useState } from 'react';
import { mockProductos } from '@/lib/mock-data';

export default function TestPage() {
  const [productos] = useState(mockProductos);
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">¡Funciona!</h1>
      <p className="mb-4">Productos: {productos.length}</p>
      <p className="mb-4">Count: {count}</p>
      
      <button 
        onClick={() => setCount(c => c + 1)}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mb-8"
      >
        Incrementar
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((prod) => (
          <div key={prod.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h2 className="font-bold text-lg">{prod.nombre}</h2>
            <p className="text-green-400">S/ {prod.precio}</p>
            <p className="text-gray-400 text-sm">{prod.descripcion?.substring(0, 50)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}
