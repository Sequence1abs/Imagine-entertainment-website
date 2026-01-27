import { NextRequest, NextResponse } from 'next/server'
import { getAllGalleryImages } from '@/lib/data/events'

/**
 * GET /api/gallery
 * Returns only images that were uploaded through the dashboard and stored in the database.
 * Does NOT fetch directly from Cloudflare Images API - only database records.
 */
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const images = await getAllGalleryImages()
    const url = new URL(request.url)
    const hasCacheBuster = url.searchParams.has('t')
    const cacheControl = (process.env.NODE_ENV === 'development' || hasCacheBuster)
      ? 'no-cache, no-store, must-revalidate, max-age=0'
      : 'public, s-maxage=3600, stale-while-revalidate=86400'
    
    return NextResponse.json({ images }, {
      headers: {
        'Cache-Control': cacheControl,
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images', images: [] },
      { status: 500 }
    )
  }
}
