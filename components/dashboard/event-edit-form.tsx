'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EVENT_CATEGORIES, type EventWithImages } from '@/lib/types/database'
import { DatePicker } from '@/components/dashboard/date-picker'
import { format } from 'date-fns'

interface EventEditFormProps {
  event: EventWithImages
}

export function EventEditForm({ event }: EventEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string || null,
      client: formData.get('client') as string || null,
      event_date: formData.get('event_date') as string || null,
      location: formData.get('location') as string || null,
      overview: formData.get('overview') as string || null,
      challenge: formData.get('challenge') as string || null,
      solution: formData.get('solution') as string || null,
      is_published: formData.get('is_published') === 'on',
    }

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update event')
      }

      setSuccess('Event updated successfully')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to delete event')
      }

      router.push('/dashboard/events')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setDeleting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold">Basic Information</h2>
        
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={event.title}
            required
            className="text-base"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            name="category"
            defaultValue={event.category}
            required
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Client */}
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Input
            id="client"
            name="client"
            defaultValue={event.client || ''}
          />
        </div>

        {/* Date & Location */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event_date">Event Date</Label>
            <input type="hidden" name="event_date" id="event_date_hidden" defaultValue={event.event_date || ''} />
            <DatePicker
              date={event.event_date ? new Date(event.event_date) : undefined}
              onDateChange={(date) => {
                const hiddenInput = document.getElementById('event_date_hidden') as HTMLInputElement
                if (hiddenInput) hiddenInput.value = date ? format(date, 'yyyy-MM-dd') : ''
              }}
              placeholder="Select event date"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={event.location || ''}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={event.description || ''}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
          />
        </div>
      </div>

      {/* Detailed Content */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold">Detailed Content</h2>
        
        {/* Overview */}
        <div className="space-y-2">
          <Label htmlFor="overview">Overview</Label>
          <textarea
            id="overview"
            name="overview"
            rows={4}
            defaultValue={event.overview || ''}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
          />
        </div>

        {/* Challenge */}
        <div className="space-y-2">
          <Label htmlFor="challenge">Challenge</Label>
          <textarea
            id="challenge"
            name="challenge"
            rows={3}
            defaultValue={event.challenge || ''}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
          />
        </div>

        {/* Solution */}
        <div className="space-y-2">
          <Label htmlFor="solution">Solution</Label>
          <textarea
            id="solution"
            name="solution"
            rows={3}
            defaultValue={event.solution || ''}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
          />
        </div>
      </div>

      {/* Publishing */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3">
          <input
            id="is_published"
            name="is_published"
            type="checkbox"
            defaultChecked={event.is_published}
            className="size-4 rounded border-input"
          />
          <Label htmlFor="is_published" className="font-normal">
            Published (visible on public site)
          </Label>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-500/10 text-green-500 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="size-4 mr-2" />
              Delete Event
            </>
          )}
        </Button>
        
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
