'use server'

/**
 * Delete an image from Cloudinary using the Admin API
 * This should be called before deleting the image record from the database
 */

/**
 * Extract the public_id from a Cloudinary URL
 * 
 * Cloudinary URLs follow patterns like:
 * - https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{filename}.{ext}
 * - https://res.cloudinary.com/{cloud}/image/upload/{transformations}/v{version}/{folder}/{filename}.{ext}
 * 
 * The public_id is: {folder}/{filename} (without extension)
 */
function extractPublicIdFromUrl(cloudinaryUrl: string): string | null {
    try {
        const url = new URL(cloudinaryUrl)
        
        // Must be a Cloudinary URL
        if (!url.hostname.includes('cloudinary.com')) {
            return null
        }

        // Get the path after /upload/
        const pathParts = url.pathname.split('/upload/')
        if (pathParts.length < 2) {
            return null
        }

        let afterUpload = pathParts[1]
        
        // Split by '/'
        const segments = afterUpload.split('/')
        
        // Find where the actual file path starts (skip transformations and version)
        // Transformations contain special characters like: w_500, c_fill, q_auto, f_auto
        // Version starts with 'v' followed by numbers
        let startIndex = 0
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i]
            // Check if this is a transformation (contains underscore with modifier) or version
            if (/^v\d+$/.test(seg)) {
                // This is a version number, the public_id starts after this
                startIndex = i + 1
                break
            }
            if (seg.includes('_') || seg.includes(',') || /^[a-z]_/.test(seg)) {
                // This looks like a transformation, continue
                continue
            }
            // This could be the start of the public_id
            startIndex = i
            break
        }

        // Join remaining segments and remove extension
        const publicIdWithExt = segments.slice(startIndex).join('/')
        
        // Remove the file extension
        const lastDotIndex = publicIdWithExt.lastIndexOf('.')
        if (lastDotIndex > 0) {
            return publicIdWithExt.substring(0, lastDotIndex)
        }
        
        return publicIdWithExt
    } catch (error) {
        console.error('Error extracting public_id from URL:', error)
        return null
    }
}

/**
 * Delete an image from Cloudinary
 * @param imageUrl - The full Cloudinary URL of the image
 * @returns Object with success status and optional error message
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
        const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
        const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
            console.error('Cloudinary not configured')
            return { success: false, error: 'Cloudinary not configured' }
        }

        const publicId = extractPublicIdFromUrl(imageUrl)
        if (!publicId) {
            console.error('Could not extract public_id from URL:', imageUrl)
            return { success: false, error: 'Could not extract public_id from URL' }
        }

        // Generate signature for the destroy request
        const crypto = await import('crypto')
        const timestamp = Math.floor(Date.now() / 1000)
        const toSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
        const signature = crypto.createHash('sha1').update(toSign).digest('hex')

        // Call Cloudinary destroy API
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    api_key: CLOUDINARY_API_KEY,
                    timestamp,
                    signature,
                }),
            }
        )

        const result = await response.json()

        if (result.result === 'ok' || result.result === 'not found') {
            // 'not found' is also acceptable - means it's already deleted
            console.log(`Cloudinary image deleted: ${publicId}`)
            return { success: true }
        } else {
            console.error('Cloudinary deletion failed:', result)
            return { success: false, error: result.error?.message || 'Deletion failed' }
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}
