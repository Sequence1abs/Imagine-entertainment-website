'use server'

import { createClient } from '@/lib/supabase/server'
import { uploadToCloudflareImages } from '@/lib/cloudflare-upload'

export async function uploadImageAction(formData: FormData) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('Unauthorized')
        }

        const file = formData.get('file') as File
        const folder = formData.get('folder') as string || 'imagine-events'
        const prefix = formData.get('prefix') as string || 'event_' // Default to event_ prefix

        if (!file) {
            throw new Error('No file provided')
        }

        // Upload to Cloudflare Images (with R2 fallback)
        const result = await uploadToCloudflareImages(file, prefix, folder)

        return {
            url: result.url,
            public_id: result.imageId || result.key, // Use imageId if available, otherwise key
            width: result.width || 0,
            height: result.height || 0,
        }
    } catch (error) {
        console.error('Error in uploadImageAction:', error)
        throw error
    }
}
