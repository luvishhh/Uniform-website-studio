import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    allowedDevOrigins: [
      'https://9000-firebase-studio-1749287199548.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev',
      // It might also be useful to allow localhost if accessing directly for other development tools
      'http://localhost:9000', // Common port for proxies or other dev tools
      'http://localhost:9002', // The actual app port
    ],
  },
};

export default nextConfig;
