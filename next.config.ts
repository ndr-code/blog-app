import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blogger-wph-api-production.up.railway.app',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'blogger-wph-api-production.up.railway.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
