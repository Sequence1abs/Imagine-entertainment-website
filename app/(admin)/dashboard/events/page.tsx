import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function EventsPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">
            Manage your portfolio events
          </p>
        </div>
        <Link href="/dashboard/events/new">
          <Button>
            <Plus className="size-4 mr-2" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Events List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {events && events.length > 0 ? (
          <div className="divide-y divide-border">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                className="block p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold truncate">{event.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        event.is_published 
                          ? 'bg-green-500/10 text-green-500' 
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {event.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.category}
                    </p>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {event.event_date && (
                      <p>{new Date(event.event_date).toLocaleDateString()}</p>
                    )}
                    {event.location && (
                      <p className="mt-1">{event.location}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="size-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No events yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Create your first event to get started
            </p>
            <Link href="/dashboard/events/new">
              <Button>
                <Plus className="size-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
