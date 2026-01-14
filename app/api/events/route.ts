import { NextResponse } from 'next/server'
import { getPublishedEvents } from '@/lib/data/events'

export async function GET() {
  try {
    const events = await getPublishedEvents()
    
    // Return with cache headers for faster subsequent loads
    // Cache for 1 hour, stale-while-revalidate for 1 day (reduces Vercel Edge Requests)
    return NextResponse.json({ 
      events,
      success: true 
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    })
  } catch (error) {
    console.error('Error in /api/events:', error)
    return NextResponse.json(
      { events: [], error: 'Failed to fetch events', success: false },
      { status: 500 }
    )
  }
}
