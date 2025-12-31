/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable compression
  compress: true,
  // Disable source maps in production for smaller bundles
  productionBrowserSourceMaps: false,
  // Experimental performance features
  experimental: {
    // Optimize package imports for tree-shaking
    optimizePackageImports: ['lucide-react', 'framer-motion'],
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
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
