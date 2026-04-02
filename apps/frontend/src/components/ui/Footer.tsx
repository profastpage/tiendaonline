import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

interface FooterProps {
  tenantName?: string;
  tenantInfo?: {
    whatsappNumero?: string;
    email?: string;
    direccion?: string;
  };
}

export function Footer({ tenantName, tenantInfo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800/50 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Información de la tienda */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">{tenantName || 'Tienda'}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Tu tienda de confianza. Pedidos fáciles y rápidos directamente por WhatsApp.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
            <div className="space-y-3">
              {tenantInfo?.whatsappNumero && (
                <a 
                  href={`https://wa.me/${tenantInfo.whatsappNumero.replace(/[^0-9]/g, '')}`}
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4 mr-3" />
                  {tenantInfo.whatsappNumero}
                </a>
              )}
              {tenantInfo?.email && (
                <a 
                  href={`mailto:${tenantInfo.email}`}
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 mr-3" />
                  {tenantInfo.email}
                </a>
              )}
              {tenantInfo?.direccion && (
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-3" />
                  {tenantInfo.direccion}
                </div>
              )}
            </div>
          </div>

          {/* Horario */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Horario de Atención</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">Lunes a Viernes</p>
                  <p>9:00 AM - 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white">Sábados</p>
                  <p>10:00 AM - 6:00 PM</p>
                </div>
              </div>
              <div className="flex items-start text-gray-500">
                <Clock className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Domingos y feriados</p>
                  <p>Cerrado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Métodos de pago */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Métodos de Pago</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                <span>Efectivo contra entrega</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                <span>Yape / Plin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                <span>Transferencia bancaria</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-gray-700 rounded"></div>
                <span>Tarjetas (próximamente)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {currentYear} {tenantName || 'Tienda'}. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-green-400 transition-colors">
                Términos y condiciones
              </a>
              <a href="#" className="hover:text-green-400 transition-colors">
                Política de privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
