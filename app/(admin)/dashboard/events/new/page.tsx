'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, FileText, ImageIcon, Images, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EVENT_CATEGORIES, type EventCategory } from '@/lib/types/database'
import { DatePicker } from '@/components/dashboard/date-picker'
import { format } from 'date-fns'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CoverUpload } from '@/components/dashboard/cover-upload'
import { GalleryUpload } from '@/components/dashboard/gallery-upload'
import { LocationAutocomplete } from '@/components/dashboard/location-autocomplete'
import { toast } from 'sonner'
import { useUploadQueue } from '@/context/upload-queue'

const GALLERY_UPLOAD_CONCURRENCY = 5

type GalleryItem = {
  id: number
  file: File
  preview: string
  url?: string
  uploading: boolean
  error?: string
}

function getCloudFolder(title: string) {
  const eventFolderName = title.trim().replace(/\s+/g, '_')
  return `IMAGINE/Events/${eventFolderName}`
}

export default function NewEventPage() {
  const router = useRouter()
  const uploadQueue = useUploadQueue()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const galleryIdRef = useRef(0)
  const galleryInFlightRef = useRef<Set<number>>(new Set())
  const coverUploadStartedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<EventCategory>('Corporate')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)

  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([])

  const uploadCover = useCallback(async (file: File, cloudFolder: string) => {
    setCoverError(null)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('prefix', 'event_')
    formData.append('folder', cloudFolder)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to upload cover')
    }
    const data = await res.json()
    return data?.url ?? null
  }, [])

  useEffect(() => {
    if (!title.trim() || !coverImageFile || coverImageUrl != null || isUploadingCover || coverUploadStartedRef.current) return
    const folder = getCloudFolder(title)
    coverUploadStartedRef.current = true
    setIsUploadingCover(true)
    uploadCover(coverImageFile, folder)
      .then((url) => setCoverImageUrl(url))
      .catch((err) => setCoverError(err instanceof Error ? err.message : 'Upload failed'))
      .finally(() => {
        setIsUploadingCover(false)
        coverUploadStartedRef.current = false
      })
  }, [title, coverImageFile, coverImageUrl, isUploadingCover, uploadCover])

  const uploadOneGallery = useCallback(async (item: GalleryItem, cloudFolder: string): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', item.file)
    formData.append('prefix', 'event_')
    formData.append('folder', cloudFolder)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) return null
    const data = await res.json()
    return data?.url ?? null
  }, [])

  useEffect(() => {
    if (!title.trim()) return
    const cloudFolder = getCloudFolder(title)
    const needUpload = galleryImages.filter((i) => i.uploading && !i.url && !i.error && !galleryInFlightRef.current.has(i.id))
    const toStart = needUpload.slice(0, GALLERY_UPLOAD_CONCURRENCY - galleryInFlightRef.current.size)
    if (toStart.length === 0) return

    toStart.forEach((item) => {
      galleryInFlightRef.current.add(item.id)
      uploadOneGallery(item, cloudFolder)
        .then((url) => {
          setGalleryImages((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, url: url ?? undefined, uploading: false } : i))
          )
        })
        .catch(() => {
          setGalleryImages((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, error: 'Upload failed', uploading: false } : i))
          )
        })
        .finally(() => {
          galleryInFlightRef.current.delete(item.id)
        })
    })
  }, [title, galleryImages, uploadOneGallery])

  const handleCoverChange = (file: File | null) => {
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    if (file) {
      setCoverImageFile(file)
      setCoverPreview(URL.createObjectURL(file))
      setCoverImageUrl(null)
      setCoverError(null)
      coverUploadStartedRef.current = false
    } else {
      setCoverImageFile(null)
      setCoverPreview(null)
      setCoverImageUrl(null)
      setCoverError(null)
      coverUploadStartedRef.current = false
    }
  }

  const handleGalleryFilesChange = (files: File[]) => {
    setGalleryImages((prev) => {
      prev.forEach((i) => URL.revokeObjectURL(i.preview))
      if (files.length === 0) return []
      return files.map((file) => ({
        id: ++galleryIdRef.current,
        file,
        preview: URL.createObjectURL(file),
        uploading: true,
      }))
    })
  }

  const readyCount = galleryImages.filter((i) => i.url).length
  const uploadingCount = galleryImages.filter((i) => i.uploading && !i.url).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    if (!title) {
      toast.error('Event title is required', { description: 'This is needed for the image folder.' })
      setIsSubmitting(false)
      return
    }

    const cloudFolder = getCloudFolder(title)
    const readyGalleryUrls = galleryImages.filter((i): i is GalleryItem & { url: string } => !!i.url).map((i) => i.url)
    const pendingCover = coverImageFile && !coverImageUrl
    const pendingGallery = galleryImages.filter((i) => i.uploading && !i.url).map((i) => i.file)

    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          event_date: eventDate || null,
          location: location || null,
          description: description || null,
          cover_image_url: coverImageUrl,
          is_published: isPublished,
        }),
      })

      if (!response.ok) throw new Error('Failed to create event')
      const { event } = await response.json()
      if (!event?.id) throw new Error('No event id returned')

      if (readyGalleryUrls.length > 0) {
        const batchRes = await fetch('/api/admin/events/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: event.id, image_urls: readyGalleryUrls }),
        })
        if (!batchRes.ok) toast.warning('Some gallery images could not be attached')
      }

      if (pendingCover || pendingGallery.length > 0) {
        uploadQueue?.addJob({
          eventId: event.id,
          eventTitle: title,
          cloudFolder,
          coverFile: pendingCover ? coverImageFile! : undefined,
          galleryFiles: pendingGallery,
        })
        toast.success('Event created! Cover and gallery uploading in background.')
      } else {
        toast.success('Event created successfully!')
      }

      router.push('/dashboard/events')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong', {
        description: 'Please try again or contact support.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/events"
          className="p-2.5 hover:bg-muted rounded-xl transition-colors border border-transparent hover:border-border shrink-0"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Create New Event</h1>
          <p className="text-muted-foreground">Add a new event to your portfolio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="size-4 text-primary" />
            </div>
            <h2 className="font-semibold">Event Details</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., BRIT AWARDS 2024"
                required
                className="mt-2"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as EventCategory)}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <div className="mt-2">
                  <DatePicker
                    date={eventDate ? new Date(eventDate) : undefined}
                    onDateChange={(date) => setEventDate(date ? format(date, 'yyyy-MM-dd') : '')}
                    placeholder="Select event date"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="mt-2">
                <LocationAutocomplete
                  id="location"
                  value={location}
                  onChange={setLocation}
                  placeholder="e.g., Colombo, Sri Lanka"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Internal Notes</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">Not shown publicly</p>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any internal notes about this event..."
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
            <div className="p-2 rounded-lg bg-primary/10">
              <ImageIcon className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Cover Image</h2>
              <p className="text-xs text-muted-foreground">Used as banner and thumbnail. Uploads when title is set.</p>
            </div>
          </div>
          <div className="p-6">
            <CoverUpload
              key={coverPreview ?? coverImageUrl ?? 'empty'}
              defaultImage={coverPreview ?? coverImageUrl ?? undefined}
              onImageChange={(file) => setTimeout(() => handleCoverChange(file ?? null), 0)}
            />
            {isUploadingCover && <p className="text-sm text-muted-foreground mt-2">Uploading cover…</p>}
            {coverError && <p className="text-sm text-destructive mt-2">{coverError}</p>}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
            <div className="p-2 rounded-lg bg-primary/10">
              <Images className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Gallery Images</h2>
              <p className="text-xs text-muted-foreground">Additional photos. Uploads in background when title is set (max 5 at a time).</p>
            </div>
          </div>
          <div className="p-6">
            <GalleryUpload
              maxFiles={20}
              onFilesChange={(files) => setTimeout(() => handleGalleryFilesChange(files), 0)}
            />
            {galleryImages.length > 0 && (
              <p className="text-sm text-muted-foreground mt-3">
                {galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''} selected
                {readyCount > 0 && ` · ${readyCount} ready`}
                {uploadingCount > 0 && ` · ${uploadingCount} uploading…`}
              </p>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} id="publish-toggle" />
              <label htmlFor="publish-toggle" className="cursor-pointer">
                <span className="font-medium block">Publish Event</span>
                <span className="text-sm text-muted-foreground">Make visible on your site</span>
              </label>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link href="/dashboard/events">
                <Button type="button" variant="outline" size="lg">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || !title} size="lg" className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
