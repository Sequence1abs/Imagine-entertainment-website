import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Cloudflare Images
 * Verifies that Cloudflare Images API is accessible
 */
export async function GET() {
  try {
    const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
    const IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN

    if (!ACCOUNT_ID || !IMAGES_API_TOKEN) {
      return NextResponse.json(
        { status: 'error', message: 'Cloudflare Images not configured' },
        { status: 503 }
      )
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1?per_page=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${IMAGES_API_TOKEN}`,
        },
      }
    )

    if (response.ok) {
      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Cloudflare Images is accessible'
      })
    } else {
      const errorText = await response.text()
      return NextResponse.json(
        { status: 'error', message: `Cloudflare Images API error: ${response.status}` },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Cloudflare Images health check error:', error)
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Connection failed' },
      { status: 503 }
    )
  }
}
