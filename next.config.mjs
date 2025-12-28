/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization is now ENABLED (removed unoptimized: true)
  // Next.js will automatically optimize images with WebP, resize, and lazy load
}

export default nextConfig
