import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import type { EventFormData } from '@/lib/types/database'
import { logActivity } from '@/lib/actions/log-activity'

type RouteParams = { params: Promise<{ id: string }> }

// GET /api/events/[id] - Get single event
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_images (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Update event (protected)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: Partial<EventFormData> = await request.json()

    const { data, error } = await supabase
      .from('events')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Log update
    await logActivity(
      "Updated Event", 
      { title: data.title, updates: Object.keys(body) }, 
      "event", 
      id,
      user.id
    )

    // Revalidate Work & Projects and Gallery so add/update/publish/unpublish shows immediately
    revalidatePath('/work')
    revalidatePath(`/work/${id}`, 'page')
    revalidatePath('/gallery')

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Delete event (protected)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get event details before deleting for log
    const { data: eventToDelete } = await supabase
      .from('events')
      .select('title')
      .eq('id', id)
      .single()

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Log deletion
    await logActivity(
      "Deleted Event", 
      { title: eventToDelete?.title }, 
      "event", 
      id,
      user.id
    )

    // Revalidate Work & Projects and Gallery so the removed event and its images disappear immediately
    revalidatePath('/work')
    revalidatePath(`/work/${id}`, 'page')
    revalidatePath('/gallery')

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
