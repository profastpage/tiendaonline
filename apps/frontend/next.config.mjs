/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Workers
  output: 'export',
  
  // Disable image optimization (use Cloudflare Images instead)
  images: {
    unoptimized: true,
  },
  
  // Disable server-side rendering for static export
  trailingSlash: true,
  
  // Remove webpack optimizations that don't work with Workers
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
