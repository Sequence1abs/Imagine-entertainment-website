'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EVENT_CATEGORIES, type EventCategory } from '@/lib/types/database'
import { DatePicker } from '@/components/dashboard/date-picker'
import { format } from 'date-fns'
import { Switch } from '@/components/ui/switch'

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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

  // Handle cover image selection
  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setCoverImageFile(file)
    const preview = URL.createObjectURL(file)
    setCoverImage(preview)
  }

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

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'imagine_events') // You need to create this in Cloudinary
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) {
        console.error('Cloudinary cloud name not configured')
        return null
      }
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )
      
      if (!response.ok) throw new Error('Upload failed')
      
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      return null
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Upload cover image if exists
      let coverImageUrl = coverImage
      if (coverImageFile) {
        setIsUploadingCover(true)
        const url = await uploadToCloudinary(coverImageFile)
        if (url) coverImageUrl = url
        setIsUploadingCover(false)
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

      // Upload gallery images
      if (galleryImages.length > 0 && event?.id) {
        setIsUploadingGallery(true)
        for (const img of galleryImages) {
          const url = await uploadToCloudinary(img.file)
          if (url) {
            await fetch('/api/admin/events/images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event_id: event.id,
                image_url: url,
              }),
            })
          }
        }
        setIsUploadingGallery(false)
      }

      router.push('/dashboard/events')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/events" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Add a new event to your portfolio</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Event Details</h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., BRIT AWARDS 2024"
                required
                className="mt-1.5"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="mt-1.5 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  required
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="eventDate">Event Date</Label>
                <div className="mt-1.5">
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
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., London, UK"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="description">Internal Notes (not shown publicly)</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any internal notes about this event..."
                rows={4}
                className="mt-1.5 w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Cover Image</h2>
          <p className="text-sm text-muted-foreground">This will be used as the banner and thumbnail</p>
          
          {coverImage ? (
            <div className="relative aspect-video w-full max-w-xl rounded-lg overflow-hidden bg-muted">
              <Image
                src={coverImage}
                alt="Cover preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setCoverImage(null)
                  setCoverImageFile(null)
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="size-4 text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="size-10 text-muted-foreground mb-4" />
              <div className="text-center">
                <p className="text-sm font-medium">Click to upload cover image</p>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Gallery Images */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Gallery Images</h2>
          <p className="text-sm text-muted-foreground">Additional images for the event gallery</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={img.preview}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                >
                  <X className="size-3 text-white" />
                </button>
              </div>
            ))}
            
            <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="size-6 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
              id="publish-toggle"
            />
            <label htmlFor="publish-toggle" className="cursor-pointer">
              <span className="font-medium block">Publish Event</span>
              <span className="text-sm text-muted-foreground">Show on public site</span>
            </label>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link href="/dashboard/events">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting || !title}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {isUploadingCover ? 'Uploading cover...' : isUploadingGallery ? 'Uploading gallery...' : 'Saving...'}
                </>
              ) : (
                'Create Event'
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}
