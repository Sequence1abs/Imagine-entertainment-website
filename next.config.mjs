import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Keep @vercel/og out of the server bundle (we use static OG images via metadata only).
  // Reduces Worker size for Cloudflare's 3 MiB free-tier limit.
  serverExternalPackages: ['@vercel/og'],
  // Exclude @vercel/og from file tracing so OpenNext sets useOg=false and externals it
  // (~2.2 MB saved). We only use static metadata openGraph images, not ImageResponse.
  // Exclude both the JS and WASM files to prevent Wrangler from trying to resolve them.
  outputFileTracingExcludes: {
    '/*': [
      'node_modules/next/dist/compiled/@vercel/og/**',
      '**/resvg.wasm',
      '**/yoga.wasm',
    ],
  },
  // Enable compression
  compress: true,
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  // Experimental performance features
  experimental: {
    // Optimize package imports for tree-shaking
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Image optimization with modern formats
  images: {
    // Enable AVIF for even better compression than WebP
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Smaller image sizes for thumbnails/icons
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.imaginesl.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.imaginesl.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/work',
        permanent: true,
      },
      {
        // Redirect old portfolio items to the main work page
        source: '/portfolio/:path*',
        destination: '/work',
        permanent: true,
      },
      {
        source: '/services.html',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
    ]
  },
  // Aggressive caching headers to reduce Vercel Edge Requests
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ],
      },
      {
        // Video files - 1 year cache for hero video and other media
        source: '/:path*.(mp4|webm|ogg|mov)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Accept-Ranges', value: 'bytes' }
        ],
      },
      {
        // Static assets (images, fonts, etc.) - 1 year cache
        source: '/:path*.(ico|png|jpg|jpeg|gif|webp|avif|svg|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      {
        // Favicon directory - 1 year cache
        source: '/favicon/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      {
        // Next.js static bundles (already have content hashes) - 1 year cache
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
    ]
  },
}

export default nextConfig
