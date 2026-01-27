import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { addGalleryImage, getStandaloneGalleryImages } from '@/lib/data/events'

async function isAuthenticated() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // 1. Get standalone gallery images
    const { data: standaloneImages, error: standaloneError } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (standaloneError) throw standaloneError

    // 2. Get event images with event details
    const { data: eventImages, error: eventError } = await supabase
      .from('event_images')
      .select('*, events(title)')
      .order('created_at', { ascending: false })

    if (eventError) throw eventError
    
    // 3. Format and combine
    const formattedStandalone = (standaloneImages || []).map(img => ({
      id: img.id,
      image_url: img.image_url,
      alt_text: img.alt_text,
      created_at: img.created_at,
      type: 'standalone' as const,
    }))

    const formattedEventImages = (eventImages || []).map(img => ({
      id: img.id,
      image_url: img.image_url,
      alt_text: img.alt_text,
      event_title: img.events?.title,
      created_at: img.created_at,
      type: 'event' as const,
    }))

    // Combine and sort by newest first
    const allImages = [...formattedStandalone, ...formattedEventImages].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    return NextResponse.json({ images: allImages })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}

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

    revalidatePath('/gallery')
    return NextResponse.json({ image, success: true })
  } catch (error) {
    console.error('Error adding gallery image:', error)
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
  }
}
