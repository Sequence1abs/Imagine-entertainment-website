import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { addGalleryImage, getStandaloneGalleryImages } from '@/lib/data/events'

// Check authentication
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('dashboard_session')
  return session?.value === 'authenticated'
}

// GET - Get all gallery images
export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const images = await getStandaloneGalleryImages()
    
    // Add type to each image
    const imagesWithType = images.map(img => ({
      ...img,
      type: 'standalone' as const,
    }))
    
    return NextResponse.json({ images: imagesWithType })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

// POST - Add standalone gallery image
export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    if (!body.image_url) {
      return NextResponse.json({ error: 'Missing image_url' }, { status: 400 })
    }

    const { data: image, error } = await addGalleryImage(
      body.image_url,
      body.alt_text
    )

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ image, success: true })
  } catch (error) {
    console.error('Error adding gallery image:', error)
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
  }
}
