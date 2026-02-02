import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { addEventImage, addEventImagesBatch } from '@/lib/data/events'

async function isAuthenticated() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.event_id) {
      return NextResponse.json({ error: 'Missing event_id' }, { status: 400 })
    }

    // Batch: { event_id, image_urls: string[] }
    if (Array.isArray(body.image_urls) && body.image_urls.length > 0) {
      const { data: images, error } = await addEventImagesBatch(
        body.event_id,
        body.image_urls
      )

      if (error) {
        return NextResponse.json({ error }, { status: 400 })
      }

      revalidatePath('/gallery')
      return NextResponse.json({ images: images ?? [], success: true })
    }

    // Single: { event_id, image_url, alt_text? }
    if (!body.image_url) {
      return NextResponse.json({ error: 'Missing image_url or image_urls' }, { status: 400 })
    }

    const { data: image, error } = await addEventImage(
      body.event_id,
      body.image_url,
      body.alt_text
    )

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    revalidatePath('/gallery')
    return NextResponse.json({ image, success: true })
  } catch (error) {
    console.error('Error adding event image:', error)
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
  }
}
