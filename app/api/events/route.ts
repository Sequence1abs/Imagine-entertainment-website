import { NextResponse } from 'next/server'
import { getPublishedEvents } from '@/lib/data/events'

export async function GET() {
  try {
    const events = await getPublishedEvents()
    
    return NextResponse.json({ 
      events,
      success: true 
    })
  } catch (error) {
    console.error('Error in /api/events:', error)
    return NextResponse.json(
      { events: [], error: 'Failed to fetch events', success: false },
      { status: 500 }
    )
  }
}
