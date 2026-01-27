import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createEvent, getAllEvents } from '@/lib/data/events'
import { logActivity } from '@/lib/actions/log-activity'

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  if (!(await getAuthenticatedUser())) {
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

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) {
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

    if (error || !event) {
      return NextResponse.json({ error: error || 'Failed to create event' }, { status: 400 })
    }

    await logActivity(
      "Created Event", 
      { title: event.title }, 
      "event", 
      event.id,
      user.id
    )

    // Revalidate Work & Projects and Gallery so the new event (and its images when added) shows immediately
    revalidatePath('/work')
    revalidatePath('/gallery')

    return NextResponse.json({ event, success: true })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
