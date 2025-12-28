import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createEvent, getAllEvents, updateEvent, deleteEvent } from '@/lib/data/events'

// Check authentication
async function isAuthenticated() {
  const cookieStore = await cookies()
  const session = cookieStore.get('dashboard_session')
  return session?.value === 'authenticated'
}

// GET - Get all events (admin)
export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const events = await getAllEvents()
    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const { data: event, error } = await createEvent({
      title: body.title,
      category: body.category,
      event_date: body.event_date,
      location: body.location,
      description: body.description,
      cover_image_url: body.cover_image_url,
      is_published: body.is_published ?? false,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({ event, success: true })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
