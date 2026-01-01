'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Loader2, ZoomIn, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GalleryUpload } from '@/components/dashboard/gallery-upload'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { logActivity } from '@/lib/actions/log-activity'
import { uploadToCloudinary } from '@/lib/cloudinary-upload'

interface GalleryImage {
  id: string
  image_url: string
  alt_text?: string
  event_title?: string
  type: 'event' | 'standalone'
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [newFiles, setNewFiles] = useState<File[]>([])

  // Confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/admin/gallery')
        if (response.ok) {
          const data = await response.json()
          setImages(data.images || [])
        } else {
          throw new Error("Failed to fetch images")
        }
      } catch (error) {
        console.error('Error fetching images:', error)
        toast.error("Failed to load gallery images")
      } finally {
        setIsLoading(false)
      }
    }
    fetchImages()
  }, [])

  // No longer needed: local uploadToCloudinary removed in favor of lib/cloudinary-upload

  // Handle upload
  const handleUpload = async () => {
    if (newFiles.length === 0) return

    setIsUploading(true)
    let successCount = 0

    try {
      for (const file of newFiles) {
        try {
          const result = await uploadToCloudinary(file, 'IMAGINE/General')
          if (result?.url) {
            const response = await fetch('/api/admin/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_url: result.url }),
            })

            if (response.ok) {
              const data = await response.json()
              if (data.image) {
                setImages(prev => [{ ...data.image, type: 'standalone' }, ...prev])
                successCount++

                // Log upload
                await logActivity("Uploaded Gallery Image", { url: data.image.image_url }, "image", data.image.id)
              }
            }
          }
        } catch (error) {
          console.error('Gallery upload failed for file:', error)
        }
      }

      // Reset
      setNewFiles([])

      if (successCount === newFiles.length) {
        toast.success("All images uploaded successfully")
      } else if (successCount > 0) {
        toast.warning(`Uploaded ${successCount} of ${newFiles.length} images`)
      } else {
        toast.error("Failed to upload images")
      }

    } catch (error) {
      console.error('Upload error:', error)
      toast.error("An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  // Execute delete after confirmation
  const executeDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)

    try {
      const imageToDelete = images.find(img => img.id === deleteId)
      if (!imageToDelete) return

      const endpoint = imageToDelete.type === 'event'
        ? `/api/admin/events/images/${deleteId}`
        : `/api/admin/gallery/${deleteId}`

      const response = await fetch(endpoint, {
        method: 'DELETE',
      })
      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== deleteId))
        toast.success("Image deleted")

        // Log deletion
        await logActivity("Deleted Image", { type: imageToDelete.type, url: imageToDelete.image_url }, "image", deleteId)

        setShowDeleteConfirm(false)
      } else {
        throw new Error("Failed to delete")
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error("Failed to delete image")
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  // Trigger delete confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setShowDeleteConfirm(true)
  }

  // Helper to optimize Cloudinary URLs for thumbnails
  const getThumbnailUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com')) {
      // Split at /upload/ and insert transformation params
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/w_400,h_400,c_fill,q_auto,f_auto/${parts[1]}`;
      }
    }
    return url;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground mt-1">
            All images from events and standalone uploads
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
          <div className="p-2 rounded-lg bg-primary/10">
            <ImageIcon className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Upload Images</h2>
            <p className="text-xs text-muted-foreground">Add standalone images to the gallery</p>
          </div>
        </div>

        <div className="p-6">
          <GalleryUpload
            key={images.length} // Force remount when new images are added to reset internal state
            maxFiles={20}
            isUploading={isUploading}
            onFilesChange={(files) => {
              // Wrap in setTimeout to prevent render-phase updates
              setTimeout(() => {
                setNewFiles(files)
              }, 0)
            }}
            onUpload={handleUpload}
          />
        </div>
      </div>

      {/* Existing Gallery Grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col max-h-[800px]">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30 shrink-0">
          <div className="p-2 rounded-lg bg-primary/10">
            <ImageIcon className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Gallery Images ({images.length})</h2>
            <p className="text-xs text-muted-foreground">All uploaded images</p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square bg-muted rounded-lg overflow-hidden"
                >
                  <Image
                    src={getThumbnailUrl(image.image_url)}
                    alt={image.alt_text || 'Gallery image'}
                    fill
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                    className="object-cover transition-transform group-hover:scale-105"
                    // Removed unoptimized to allow Next.js optimization or use our manual optimization
                    // We keep 'unoptimized' if we want to rely strictly on our Cloudinary transform string
                    // But using Next.js Image with a manually optimized source is fine too. 
                    // To be safe and fast, let's rely on the Cloudinary transform string we built.
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      onClick={() => setSelectedImage(image.image_url)}
                      variant="secondary"
                      size="icon"
                      className="size-8"
                      type="button"
                    >
                      <ZoomIn className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(image.id)}
                      variant="destructive"
                      size="icon"
                      className="size-8"
                      type="button"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${image.type === 'event' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                      {image.type === 'event' ? 'Event' : 'Gallery'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <ImageIcon className="size-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No images yet</h3>
              <p className="text-muted-foreground mt-1">
                Upload images above or add them through events
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={selectedImage}
              alt="Preview"
              width={1200}
              height={800}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={() => setSelectedImage(null)}
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 size-8"
              type="button"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Image?"
        description="This action cannot be undone. This image will be permanently removed from the gallery."
        onConfirm={executeDelete}
        loading={isDeleting}
        variant="destructive"
        confirmText="Delete Image"
      />
    </div>
  )
}
