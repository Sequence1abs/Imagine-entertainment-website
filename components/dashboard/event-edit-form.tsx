'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, FileText, ImageIcon, Images } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { EVENT_CATEGORIES, type EventWithImages, type EventCategory } from '@/lib/types/database'
import { DatePicker } from '@/components/dashboard/date-picker'
import { format } from 'date-fns'
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
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useUploadQueue } from '@/context/upload-queue'

const GALLERY_UPLOAD_CONCURRENCY = 5

type NewGalleryItem = { id: number; file: File; preview: string; url?: string; uploading: boolean; error?: string }

function getCloudFolder(title: string) {
  return `IMAGINE/Events/${title.trim().replace(/\s+/g, '_')}`
}

interface EventEditFormProps {
  event: EventWithImages
}

export function EventEditForm({ event }: EventEditFormProps) {
  const router = useRouter()
  const uploadQueue = useUploadQueue()
  const galleryIdRef = useRef(0)
  const galleryInFlightRef = useRef<Set<number>>(new Set())

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(event.title)
  const [isPublished, setIsPublished] = useState(event.is_published)
  const [category, setCategory] = useState<EventCategory>(event.category as EventCategory)
  const [location, setLocation] = useState(event.location || '')

  const [coverImage, setCoverImage] = useState<string | null>(event.cover_image_url)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<{ id?: string; url: string; file?: File }[]>(
    event.event_images?.map(img => ({ id: img.id, url: img.image_url })) || []
  )
  const [newGalleryImages, setNewGalleryImages] = useState<NewGalleryItem[]>([])
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const uploadOneGallery = useCallback(async (item: NewGalleryItem, cloudFolder: string): Promise<string | null> => {
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
    const needUpload = newGalleryImages.filter((i) => i.uploading && !i.url && !i.error && !galleryInFlightRef.current.has(i.id))
    const toStart = needUpload.slice(0, GALLERY_UPLOAD_CONCURRENCY - galleryInFlightRef.current.size)
    if (toStart.length === 0) return
    toStart.forEach((item) => {
      galleryInFlightRef.current.add(item.id)
      uploadOneGallery(item, cloudFolder)
        .then((url) => {
          setNewGalleryImages((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, url: url ?? undefined, uploading: false } : i))
          )
        })
        .catch(() => {
          setNewGalleryImages((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, error: 'Upload failed', uploading: false } : i))
          )
        })
        .finally(() => {
          galleryInFlightRef.current.delete(item.id)
        })
    })
  }, [title, newGalleryImages, uploadOneGallery])

  const handleNewGalleryFilesChange = (files: File[]) => {
    setNewGalleryImages((prev) => {
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

  // Remove existing gallery image (Action)
  const executeDeleteImage = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      await fetch(`/api/admin/events/images/${deleteId}`, {
        method: 'DELETE',
      })
      setGalleryImages(prev => prev.filter((img) => img.id !== deleteId))
      toast.success("Image deleted")
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Failed to delete image:', error)
      toast.error("Failed to delete image")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const formTitle = (formData.get('title') as string) || title
    if (!formTitle?.trim()) {
      toast.error('Title is required')
      setLoading(false)
      return
    }
    const cloudFolder = getCloudFolder(formTitle)
    const readyNewUrls = newGalleryImages.filter((i): i is NewGalleryItem & { url: string } => !!i.url).map((i) => i.url)
    const pendingGallery = newGalleryImages.filter((i) => i.uploading && !i.url).map((i) => i.file)

    try {
      let coverImageUrl = coverImage
      if (coverImageFile) {
        setIsUploadingCover(true)
        try {
          const uploadFormData = new FormData()
          uploadFormData.append('file', coverImageFile)
          uploadFormData.append('prefix', 'event_')
          uploadFormData.append('folder', cloudFolder)
          const uploadResponse = await fetch('/api/upload', { method: 'POST', body: uploadFormData })
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error || 'Failed to upload cover image')
          }
          const result = await uploadResponse.json()
          if (result?.url) coverImageUrl = result.url
        } catch (error) {
          console.error('Cover upload failed:', error)
          toast.error(error instanceof Error ? error.message : 'Failed to upload cover image')
          setLoading(false)
          return
        } finally {
          setIsUploadingCover(false)
        }
      }

      const data = {
        title: formTitle,
        category: category,
        description: (formData.get('description') as string) || null,
        event_date: (formData.get('event_date') as string) || null,
        location: location || null,
        cover_image_url: coverImageUrl,
        is_published: isPublished,
      }

      const response = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to update event')

      if (readyNewUrls.length > 0) {
        const batchRes = await fetch('/api/admin/events/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_id: event.id, image_urls: readyNewUrls }),
        })
        if (!batchRes.ok) toast.warning('Some gallery images could not be attached')
      }

      if (pendingGallery.length > 0) {
        uploadQueue?.addJob({
          eventId: event.id,
          eventTitle: formTitle,
          cloudFolder,
          galleryFiles: pendingGallery,
        })
        toast.success('Event updated! Remaining images uploading in background.')
      } else {
        toast.success('Event updated successfully')
      }
      setNewGalleryImages([])
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="size-4 text-primary" />
            </div>
            <h2 className="font-semibold">Event Details</h2>
          </div>

          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., BRIT AWARDS 2024"
                required
                className="mt-2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Category */}
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

              {/* Event Date */}
              <div>
                <Label htmlFor="event_date">Event Date</Label>
                <input type="hidden" name="event_date" id="event_date_hidden" defaultValue={event.event_date || ''} />
                <div className="mt-2">
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
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <div className="mt-2">
                <LocationAutocomplete
                  id="location"
                  name="location"
                  value={location}
                  onChange={setLocation}
                  placeholder="e.g., Colombo, Sri Lanka"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Internal Notes</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">Not shown publicly</p>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={event.description || ''}
                placeholder="Add any internal notes about this event..."
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
            <div className="p-2 rounded-lg bg-primary/10">
              <ImageIcon className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Cover Image</h2>
              <p className="text-xs text-muted-foreground">Used as banner and thumbnail</p>
            </div>
          </div>

          <div className="p-6">
            <CoverUpload
              defaultImage={coverImage}
              onImageChange={(file) => {
                setTimeout(() => {
                  if (file) {
                    setCoverImageFile(file)
                    const preview = URL.createObjectURL(file)
                    setCoverImage(preview)
                  } else {
                    setCoverImageFile(null)
                    setCoverImage(null)
                  }
                }, 0)
              }}
            />
          </div>
        </div>

        {/* Gallery Images */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
            <div className="p-2 rounded-lg bg-primary/10">
              <Images className="size-4 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Gallery Images</h2>
              <p className="text-xs text-muted-foreground">Additional photos. New images upload in background when title is set (max 5 at a time).</p>
            </div>
          </div>

          <div className="p-6">
            {newGalleryImages.length > 0 && (
              <p className="text-sm text-muted-foreground mb-3">
                {newGalleryImages.length} new image{newGalleryImages.length !== 1 ? 's' : ''}
                {newGalleryImages.filter((i) => i.url).length > 0 && ` · ${newGalleryImages.filter((i) => i.url).length} ready`}
                {newGalleryImages.filter((i) => i.uploading && !i.url).length > 0 && ` · ${newGalleryImages.filter((i) => i.uploading && !i.url).length} uploading…`}
              </p>
            )}
            <GalleryUpload
              defaultImages={galleryImages.filter(img => img.id).map((img) => ({
                id: img.id!,
                url: img.url,
              }))}
              maxFiles={20}
              onFilesChange={(files) => setTimeout(() => handleNewGalleryFilesChange(files), 0)}
              onRemoveExisting={(id) => {
                setDeleteId(id)
                setShowDeleteConfirm(true)
              }}
            />
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Switch
                checked={isPublished}
                onCheckedChange={setIsPublished}
                id="publish-toggle"
              />
              <label htmlFor="publish-toggle" className="cursor-pointer">
                <span className="font-medium block">Publish Event</span>
                <span className="text-sm text-muted-foreground">Make visible on your site</span>
              </label>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button type="submit" disabled={loading || isUploadingCover} size="lg" className="gap-2">
                {loading || isUploadingCover ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isUploadingCover ? 'Uploading cover…' : 'Saving…'}
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Image?"
        description="This action cannot be undone. This image will be permanently removed from the event gallery."
        onConfirm={executeDeleteImage}
        loading={isDeleting}
        variant="destructive"
        confirmText="Delete Image"
      />
    </>
  )
}
