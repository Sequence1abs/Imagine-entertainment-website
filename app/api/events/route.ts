import { NextResponse } from 'next/server'
import { getPublishedEvents } from '@/lib/data/events'

export async function GET() {
  try {
    const events = await getPublishedEvents()
    return NextResponse.json({ 
      events,
      success: true 
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // 1h cache, 1d swr
      }
    })
  } catch (error) {
    console.error('Error in /api/events:', error)
    return NextResponse.json(
      { events: [], error: 'Failed to fetch events', success: false },
      { status: 500, headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
    )
  }
}
