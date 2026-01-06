'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, Save, FileText, ImageIcon, Images, Upload, X } from 'lucide-react'
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
import { uploadToCloudinary } from '@/lib/cloudinary-upload'

interface EventEditFormProps {
  event: EventWithImages
}

export function EventEditForm({ event }: EventEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(event.is_published)
  const [category, setCategory] = useState<EventCategory>(event.category as EventCategory)
  const [location, setLocation] = useState(event.location || '')

  // Image state
  const [coverImage, setCoverImage] = useState<string | null>(event.cover_image_url)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<{ id?: string; url: string; file?: File }[]>(
    event.event_images?.map(img => ({ id: img.id, url: img.image_url })) || []
  )
  const [newGalleryImages, setNewGalleryImages] = useState<{ file: File; preview: string }[]>([])
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)

  // Confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Handle gallery images change
  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setNewGalleryImages(prev => [...prev, ...newImages])
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

  // Remove new gallery image
  const removeNewGalleryImage = (index: number) => {
    setNewGalleryImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  // No longer needed: local uploadToCloudinary removed in favor of lib/cloudinary-upload

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string

    if (!title) {
      toast.error('Title is required')
      setLoading(false)
      return
    }

    // Generate folder path: IMAGINE/Events/EVENT_NAME
    const eventFolderName = title.trim().replace(/\s+/g, '_')
    const cloudFolder = `IMAGINE/Events/${eventFolderName}`

    try {
      // Upload cover image if changed
      // Upload cover image if changed
      let coverImageUrl = coverImage
      if (coverImageFile) {
        setIsUploadingCover(true)
        try {
          const result = await uploadToCloudinary(coverImageFile, cloudFolder)
          if (result?.url) coverImageUrl = result.url
        } catch (error) {
          console.error('Cover upload failed:', error)
          toast.error(error instanceof Error ? error.message : 'Failed to upload cover image')
        } finally {
          setIsUploadingCover(false)
        }
      }
      const data = {
        title: formData.get('title') as string,
        category: category,
        description: formData.get('description') as string || null,
        event_date: formData.get('event_date') as string || null,
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

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update event')
      }

      // Upload new gallery images
      if (newGalleryImages.length > 0) {
        setIsUploadingGallery(true)
        let successCount = 0
        for (const img of newGalleryImages) {
          try {
            const result = await uploadToCloudinary(img.file, cloudFolder)
            if (result?.url) {
              await fetch('/api/admin/events/images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  event_id: event.id,
                  image_url: result.url,
                }),
              })
              successCount++
            }
          } catch (error) {
            console.error('Gallery image upload failed:', error)
            toast.error(error instanceof Error ? error.message : 'Gallery image upload failed')
          }
        }
        setIsUploadingGallery(false)
        setNewGalleryImages([])
        if (successCount < newGalleryImages.length) {
          toast.warning(`Event updated, but some new images failed to upload (${successCount}/${newGalleryImages.length})`)
        }
      }

      toast.success('Event updated successfully')
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
                defaultValue={event.title}
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
              <p className="text-xs text-muted-foreground">Additional photos for the event</p>
            </div>
          </div>

          <div className="p-6">
            <GalleryUpload
              defaultImages={galleryImages.filter(img => img.id).map((img) => ({
                id: img.id!,
                url: img.url,
              }))}
              maxFiles={20}
              onFilesChange={(files) => {
                // Wrap in setTimeout to prevent render-phase updates
                setTimeout(() => {
                  const previews = files.map((file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                  }))
                  setNewGalleryImages(previews)
                }, 0)
              }}
              onRemoveExisting={async (id) => {
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
              <Button type="submit" disabled={loading || isUploadingCover || isUploadingGallery} size="lg" className="gap-2">
                {loading || isUploadingCover || isUploadingGallery ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isUploadingCover ? 'Uploading Cover...' : isUploadingGallery ? 'Uploading Photos...' : 'Saving...'}
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
