import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { deleteEventImage } from '@/lib/data/events'

async function isAuthenticated() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Missing image ID' }, { status: 400 })
    }

    const { error } = await deleteEventImage(id)

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }

    // Revalidate gallery so removed event images disappear immediately
    revalidatePath('/gallery')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}
