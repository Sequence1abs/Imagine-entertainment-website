import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Cloudinary upload configuration
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

// POST /api/upload - Upload image to Cloudinary (protected)
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

    // Check if Cloudinary is configured
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary not configured' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'imagine-events'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    // Generate signature for upload
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = await generateSignature(timestamp, folder)

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: dataUri,
          api_key: CLOUDINARY_API_KEY,
          timestamp,
          signature,
          folder,
        }),
      }
    )

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text()
      console.error('Cloudinary upload failed:', error)
      return NextResponse.json(
        { error: 'Upload failed' },
        { status: 500 }
      )
    }

    const result = await cloudinaryResponse.json()

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate Cloudinary signature
async function generateSignature(timestamp: number, folder: string): Promise<string> {
  const crypto = await import('crypto')
  const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`
  return crypto.createHash('sha1').update(toSign).digest('hex')
}
