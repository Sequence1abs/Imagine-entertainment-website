'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, X, Loader2, FileText, ImageIcon, Images, Send } from 'lucide-react'
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

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])



  // Form state
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<EventCategory>('Corporate')
  const [eventDate, setEventDate] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  // Image state
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [galleryImages, setGalleryImages] = useState<{ file: File; preview: string }[]>([])
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)

  // Handle gallery images selection
  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setGalleryImages(prev => [...prev, ...newImages])
  }

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  // Using Cloudflare Images upload with event_ prefix

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!title) {
      toast.error('Event title is required', {
        description: 'This is needed to create the image folder.'
      })
      setIsSubmitting(false)
      return
    }

    // Generate folder path: IMAGINE/Events/EVENT_NAME
    const eventFolderName = title.trim().replace(/\s+/g, '_')
    const cloudFolder = `IMAGINE/Events/${eventFolderName}`

    try {
      // Upload cover image if exists
      let coverImageUrl = coverImage
      if (coverImageFile) {
        setIsUploadingCover(true)
        try {
          const uploadFormData = new FormData()
          uploadFormData.append('file', coverImageFile)
          uploadFormData.append('prefix', 'event_')
          uploadFormData.append('folder', cloudFolder)
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          })
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error || 'Failed to upload cover image')
          }
          
          const result = await uploadResponse.json()
          if (result?.url) coverImageUrl = result.url
          else throw new Error("Failed to upload cover image")
        } catch (error) {
          console.error('Cover upload failed:', error)
          toast.error(error instanceof Error ? error.message : 'Failed to upload cover image')
          setIsSubmitting(false)
          return
        } finally {
          setIsUploadingCover(false)
        }
      }

      // Create event
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

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      const { event } = await response.json()

      // Upload gallery images in parallel for faster performance
      if (galleryImages.length > 0 && event?.id) {
        setIsUploadingGallery(true)
        try {
          // Upload all images in parallel
          const uploadPromises = galleryImages.map(async (img) => {
            const uploadFormData = new FormData()
            uploadFormData.append('file', img.file)
            uploadFormData.append('prefix', 'event_')
            uploadFormData.append('folder', cloudFolder)
            
            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: uploadFormData,
            })
            
            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json()
              throw new Error(errorData.error || 'Failed to upload gallery image')
            }
            
            const result = await uploadResponse.json()
            return result?.url || null
          })
          
          // Wait for all uploads to complete
          const uploadedUrls = await Promise.all(uploadPromises)
          
          // Filter out failed uploads and batch save to database
          const validUrls = uploadedUrls.filter((url): url is string => url !== null)
          
          if (validUrls.length > 0) {
            // Save all images to database in parallel
            const savePromises = validUrls.map(url =>
              fetch('/api/admin/events/images', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  event_id: event.id,
                  image_url: url,
                }),
              })
            )
            
            await Promise.all(savePromises)
          }
          
          if (validUrls.length < galleryImages.length) {
            toast.warning(`Event created, but ${galleryImages.length - validUrls.length} image(s) failed to upload`)
          }
        } catch (error) {
          console.error('Gallery image upload failed:', error)
          toast.error(error instanceof Error ? error.message : 'Some gallery images failed to upload')
        } finally {
          setIsUploadingGallery(false)
        }
      }

      toast.success('Event created successfully!')
      router.push('/dashboard/events')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong', {
        description: 'Please try again or contact support.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
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
              maxFiles={20}
              onFilesChange={(files) => {
                const previews = files.map((file) => ({
                  file,
                  preview: URL.createObjectURL(file),
                }))
                // Defer state update to avoid "update while rendering" error
                setTimeout(() => {
                  setGalleryImages(previews)
                }, 0)
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
              <Link href="/dashboard/events">
                <Button type="button" variant="outline" size="lg">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting || !title} size="lg" className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {isUploadingCover ? 'Uploading cover...' : isUploadingGallery ? 'Uploading gallery...' : 'Saving...'}
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
