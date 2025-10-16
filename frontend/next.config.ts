import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',

  // Disable telemetry
  productionBrowserSourceMaps: false,

  // Configure images
  images: {
    unoptimized: true
  },

  // Disable ESLint during builds for Docker
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during builds for Docker
  typescript: {
    ignoreBuildErrors: true,
  },

  // API route health check
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health'
      }
    ];
  }
};

export default withNextIntl(nextConfig);
