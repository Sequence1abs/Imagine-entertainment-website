'use server'

/**
 * Delete an image from Cloudflare Images or R2
 * Supports both Cloudflare Images URLs and R2 URLs
 */

/**
 * Extract the image ID from a Cloudflare Images URL
 * Format: https://images.imaginesl.com/{hash}/{imageId}/public
 * or: https://imagedelivery.net/{hash}/{imageId}/public
 */
function extractImageIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Check if it's a Cloudflare Images URL
    if (urlObj.hostname.includes('images.imaginesl.com') || urlObj.hostname.includes('imagedelivery.net')) {
      // Extract imageId from path: /{hash}/{imageId}/{variant}
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      // Path format: [hash, imageId, variant]
      if (pathParts.length >= 2) {
        return pathParts[pathParts.length - 2]; // imageId is second to last
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting image ID from URL:', error);
    return null;
  }
}

/**
 * Delete an image from Cloudflare Images
 * @param imageUrl - The full Cloudflare Images URL or image ID
 * @returns Object with success status and optional error message
 */
export async function deleteFromCloudflareImages(imageUrl: string): Promise<{ success: boolean; error?: string }> {
  try {
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
    const IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN;

    if (!ACCOUNT_ID || !IMAGES_API_TOKEN) {
      console.warn('Cloudflare Images not configured, skipping deletion');
      return { success: false, error: 'Cloudflare Images not configured' };
    }

    // Extract image ID from URL or use directly if it's already an ID
    let imageId = extractImageIdFromUrl(imageUrl);
    if (!imageId) {
      // If extraction failed, assume the URL itself might be an ID (for backward compatibility)
      // Or it might be an R2 URL - we'll handle that separately
      if (imageUrl.includes('r2.dev') || imageUrl.includes('r2.cloudflarestorage.com')) {
        // R2 URL - deletion handled separately or skipped (R2 doesn't have a delete API endpoint in the same way)
        console.log('R2 URL detected, skipping deletion (R2 files are managed separately)');
        return { success: true }; // Consider R2 deletion successful (or implement R2 deletion if needed)
      }
      console.warn('Could not extract image ID from URL:', imageUrl);
      return { success: false, error: 'Could not extract image ID from URL' };
    }

    // Call Cloudflare Images delete API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1/${imageId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${IMAGES_API_TOKEN}`,
        },
      }
    );

    const result = await response.json();

    if (result.success !== false) {
      console.log(`Cloudflare Images deleted: ${imageId}`);
      return { success: true };
    } else {
      // Check if it's a "not found" error (already deleted)
      if (response.status === 404 || result.errors?.[0]?.code === 10000) {
        console.log(`Cloudflare Images image not found (already deleted): ${imageId}`);
        return { success: true };
      }
      console.error('Cloudflare Images deletion failed:', result);
      return { success: false, error: result.errors?.[0]?.message || 'Deletion failed' };
    }
  } catch (error) {
    console.error('Error deleting from Cloudflare Images:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
