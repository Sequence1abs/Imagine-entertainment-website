export const siteConfig = {
  cloudflare: {
    imageHash: "VXLIc7g8zCNPFDQiYCuvsg",
    imageDomain: "images.imaginesl.com",
  }
}

/**
 * Cloudflare Images variants:
 * - thumbnail: ~200px width, fastest loading, use for grid thumbnails
 * - gallery: ~800px width, medium quality, use for gallery grids
 * - public: full size, highest quality, use for lightbox/detail views
 * - hero: optimized for hero sections
 */
export type CloudflareVariant = 'thumbnail' | 'gallery' | 'public' | 'hero'

/**
 * Get Cloudflare Images URL with optional variant
 * @param imageId - The Cloudflare Images ID
 * @param variant - Variant name (public, thumbnail, gallery, hero). Defaults to 'public'
 */
export const getCloudflareImageUrl = (imageId: string, variant: CloudflareVariant = 'public') => 
  `https://${siteConfig.cloudflare.imageDomain}/${siteConfig.cloudflare.imageHash}/${imageId}/${variant}`

/**
 * Convert a Cloudflare Images URL to use a different variant
 * NOTE: Custom variants (gallery, thumbnail, hero) must be configured in Cloudflare dashboard.
 * If not configured, use 'public' which is the default variant that always exists.
 * @param url - Full Cloudflare Images URL
 * @param variant - Target variant (defaults to 'public' for safety)
 */
export const getVariantUrl = (url: string, variant: CloudflareVariant = 'public'): string => {
  if (!url || !url.trim()) return url
  
  // Check if it's a Cloudflare Images URL
  if (!url.includes('images.imaginesl.com') && !url.includes('imagedelivery.net')) {
    return url // Return as-is for non-Cloudflare URLs
  }
  
  // If URL already has a variant suffix, keep it (don't change to potentially non-existent variant)
  if (/\/(public|thumbnail|gallery|hero)$/.test(url)) {
    return url // Keep original variant
  }
  // If no variant suffix, add /public (guaranteed to exist)
  return url.endsWith('/') ? url + 'public' : url + '/public'
}

/**
 * Get thumbnail URL for an image (supports Cloudflare Images and R2)
 * @param url - Full image URL (Cloudflare Images or R2)
 */
export const getThumbnailUrl = (url: string): string => {
  if (!url || !url.trim()) return '';
  
  // Cloudflare Images URL format: https://images.imaginesl.com/{hash}/{imageId}/public
  // or: https://imagedelivery.net/{hash}/{imageId}/public
  if (url.includes('images.imaginesl.com') || url.includes('imagedelivery.net')) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      
      // Path format: [hash, imageId, variant]
      // For images.imaginesl.com: /{hash}/{imageId}/{variant}
      // For imagedelivery.net: /{hash}/{imageId}/{variant}
      if (pathParts.length >= 3) {
        // pathParts = [hash, imageId, variant]
        const imageId = pathParts[pathParts.length - 2]; // imageId is second to last
        if (imageId && imageId.trim()) {
          return getCloudflareImageUrl(imageId, 'thumbnail');
        }
      }
      
      // Fallback: try to replace /public with /thumbnail
      const thumbnailUrl = url.replace(/\/public$/, '/thumbnail');
      // If replacement didn't change the URL, try replacing any variant
      if (thumbnailUrl !== url) {
        return thumbnailUrl;
      }
      const replacedUrl = url.replace(/\/(public|gallery|hero)$/, '/thumbnail');
      if (replacedUrl !== url) {
        return replacedUrl;
      }
      
      // If we can't determine the variant, return original
      return url;
    } catch {
      // If URL parsing fails, try simple replacement
      const thumbnailUrl = url.replace(/\/public$/, '/thumbnail');
      if (thumbnailUrl !== url) {
        return thumbnailUrl;
      }
      const replacedUrl = url.replace(/\/(public|gallery|hero)$/, '/thumbnail');
      if (replacedUrl !== url) {
        return replacedUrl;
      }
      // Return original if we can't parse
      return url;
    }
  }
  
  // R2 or other URLs - return as-is (use original URL for thumbnails)
  return url;
}
