/** @type {import('next').NextConfig} */
const nextConfig = {
  // Soporte para subdominios multi-tenant
  async rewrites() {
    return [
      // API proxy al backend
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
  
  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000',
  },
  
  // Imágenes externas permitidas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
