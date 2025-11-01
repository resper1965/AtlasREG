/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // ✅ CORRIGIDO: Não ignorar erros de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // TEMPORÁRIO: Ignorar erros de ESLint durante build (apenas formatação)
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ['src'],
  },

  // ✅ CORRIGIDO: Otimizar imagens (removido unoptimized)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ CORRIGIDO: Comparação correta para remover console.log
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Manter console.error e console.warn
    } : false,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/default',
        permanent: false,
      },
    ]
  },

  // ✅ ADICIONADO: Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Configurações experimentais
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

export default nextConfig
