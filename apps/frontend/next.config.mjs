/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizado para Vercel
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
