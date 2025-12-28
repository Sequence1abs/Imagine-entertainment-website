import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EventEditForm } from '@/components/dashboard/event-edit-form'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      *,
      event_images (*)
    `)
    .eq('id', id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/events"
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <p className="text-muted-foreground">{event.category}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm rounded-full ${
            event.is_published 
              ? 'bg-green-500/10 text-green-500' 
              : 'bg-yellow-500/10 text-yellow-500'
          }`}>
            {event.is_published ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <EventEditForm event={event} />
    </div>
  )
}
