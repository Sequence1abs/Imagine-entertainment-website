"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Loader2 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeleteEventButton } from "@/components/dashboard/delete-event-button"
import { EVENT_CATEGORIES, Event } from "@/lib/types/database"

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      setError('Failed to load events')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Filter Logic
  const filteredEvents = events.filter(event => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      event.title.toLowerCase().includes(searchLower) ||
      (event.location && event.location.toLowerCase().includes(searchLower)) ||
      event.category.toLowerCase().includes(searchLower)
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  // Format event title helper - capitalize first letter of each word
  const formatTitle = (title: string) => {
    return title
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header & Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground mt-1">
              Manage your portfolio events
            </p>
          </div>
          <Link href="/dashboard/events/new" className="cursor-pointer">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Plus className="size-5" />
              New Event
            </Button>
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">All Categories</SelectItem>
              {EVENT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              {/* Thumbnail and Content Row on Mobile */}
              <div className="flex items-start gap-3 sm:flex-1 sm:items-center">
                {/* Thumbnail */}
                <Link href={`/dashboard/events/${event.id}`} className="shrink-0 cursor-pointer">
                  <div className="relative size-16 sm:size-20 rounded-lg overflow-hidden bg-muted">
                    {event.cover_image_url ? (
                      <Image
                        src={event.cover_image_url}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                        <Calendar className="size-5 sm:size-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <Link href={`/dashboard/events/${event.id}`} className="flex-1 min-w-0 cursor-pointer">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-2 sm:truncate group-hover:text-primary transition-colors mb-0.5 sm:mb-1">
                    {formatTitle(event.title)}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {event.category}
                  </p>
                  {(event.event_date || event.location) && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                      {event.event_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(event.event_date)}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{event.location}</span>
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </div>

              {/* Right side - Status and Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pl-[calc(4rem+0.75rem)] sm:pl-0">
                <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md ${
                  event.is_published 
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                }`}>
                  {event.is_published ? 'Published' : 'Draft'}
                </span>
                <DeleteEventButton eventId={event.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="relative overflow-hidden bg-gradient-to-b from-card to-card/50 border border-border rounded-2xl">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="relative p-16 text-center">
            <div className="inline-flex items-center justify-center size-20 rounded-2xl bg-primary/10 mb-6">
              <Calendar className="size-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold">
              {events.length === 0 ? "No events yet" : "No events found"}
            </h3>
            <p className="text-muted-foreground mt-2 mb-8 max-w-md mx-auto">
              {events.length === 0 
                ? "Create your first event to showcase your amazing work. Add photos, details, and publish it to your portfolio."
                : "Try adjusting your search or filters to find what you're looking for."}
            </p>
            {events.length === 0 && (
              <Link href="/dashboard/events/new" className="cursor-pointer">
                <Button size="lg" className="gap-2">
                  <Plus className="size-5" />
                  Create Your First Event
                </Button>
              </Link>
            )}
            {events.length > 0 && (
               <Button variant="outline" onClick={() => {
                 setSearchQuery("")
                 setSelectedCategory("all")
               }}>
                 Clear Filters
               </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
