import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    // Fetch both Sri Lankan-specific and global results in parallel
    const [sriLankaResponse, globalResponse] = await Promise.all([
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=lk`,
        {
          headers: {
            'User-Agent': 'Imagine Entertainment Website',
            'Accept': 'application/json',
          }
        }
      ),
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Imagine Entertainment Website',
            'Accept': 'application/json',
          }
        }
      )
    ])

    const sriLankaData = sriLankaResponse.ok ? await sriLankaResponse.json() : []
    const globalData = globalResponse.ok ? await globalResponse.json() : []

    // Combine results: Sri Lankan locations first, then others
    const sriLankanLocations = sriLankaData.filter((item: any) => 
      item.address?.country_code?.toLowerCase() === 'lk' || 
      item.address?.country?.toLowerCase().includes('sri lanka')
    )

    // Get non-Sri Lankan locations from global results
    const otherLocations = globalData.filter((item: any) => {
      const countryCode = item.address?.country_code?.toLowerCase()
      const country = item.address?.country?.toLowerCase() || ''
      return countryCode !== 'lk' && !country.includes('sri lanka')
    })

    // Merge: Sri Lankan locations first, then others (up to 5 total)
    const merged = [...sriLankanLocations, ...otherLocations]
    const uniqueResults = merged.filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t) => t.place_id === item.place_id)
    )

    return NextResponse.json({ 
      suggestions: uniqueResults.slice(0, 5) 
    })
  } catch (error) {
    console.error('Failed to fetch location suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location suggestions', suggestions: [] },
      { status: 500 }
    )
  }
}

