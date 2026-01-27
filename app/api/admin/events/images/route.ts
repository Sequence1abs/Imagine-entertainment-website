import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addEventImage } from '@/lib/data/events'

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
    
    if (!body.event_id || !body.image_url) {
      return NextResponse.json({ error: 'Missing event_id or image_url' }, { status: 400 })
    }

    const { data: image, error } = await addEventImage(
      body.event_id,
      body.image_url,
      body.alt_text
    )

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ image, success: true })
  } catch (error) {
    console.error('Error adding event image:', error)
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 })
  }
}
