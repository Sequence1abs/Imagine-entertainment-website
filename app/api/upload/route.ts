import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudflareImages } from '@/lib/cloudflare-upload'

// POST /api/upload - Upload image to Cloudflare Images (with R2 fallback) (protected)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'imagine-events'
    const prefix = formData.get('prefix') as string || 'event_' // Default to event_ prefix

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload to Cloudflare Images (with R2 fallback)
    const result = await uploadToCloudflareImages(file, prefix, folder)

    return NextResponse.json({
      url: result.url,
      public_id: result.imageId || result.key, // Use imageId if available, otherwise key
      width: result.width || 0,
      height: result.height || 0,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
