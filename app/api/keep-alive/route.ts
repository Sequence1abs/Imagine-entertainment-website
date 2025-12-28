import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// This endpoint is called by Vercel cron to keep Supabase active
export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Simple query to keep the database active
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Keep-alive query failed:', error)
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Database is active'
    })
  } catch (error) {
    console.error('Keep-alive error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
