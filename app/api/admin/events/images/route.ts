import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { addEventImage } from '@/lib/data/events'

// Check authentication
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('dashboard_session')
  return session?.value === 'authenticated'
}

// POST - Add image to event
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
