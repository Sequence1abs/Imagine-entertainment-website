'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Loader2, ZoomIn, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GalleryUpload } from '@/components/dashboard/gallery-upload'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { logActivity } from '@/lib/actions/log-activity'
import { getThumbnailUrl } from '@/lib/config'

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
          const fetchedImages = data.images || []
          
          // Debug: Log image URLs to check format
          if (fetchedImages.length > 0) {
            console.log('Fetched gallery images:', fetchedImages.length)
            fetchedImages.forEach((img: GalleryImage, index: number) => {
              console.log(`Image ${index + 1}:`, {
                id: img.id,
                url: img.image_url,
                thumbnail: getThumbnailUrl(img.image_url),
                type: img.type
              })
            })
          }
          
          setImages(fetchedImages)
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

  // Using Cloudflare Images upload with gallery_ prefix

  // Handle upload - optimized with parallel uploads
  const handleUpload = async () => {
    if (newFiles.length === 0) return

    setIsUploading(true)
    const filesToUpload = [...newFiles]
    setNewFiles([]) // Clear immediately for better UX

    try {
      // Upload all images in parallel
      const uploadPromises = filesToUpload.map(async (file) => {
        try {
          const uploadFormData = new FormData()
          uploadFormData.append('file', file)
          uploadFormData.append('prefix', 'gallery_')
          uploadFormData.append('folder', 'IMAGINE/General')
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          })
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error || 'Failed to upload image')
          }
          
          const result = await uploadResponse.json()
          return result?.url || null
        } catch (error) {
          console.error('Gallery upload failed for file:', file.name, error)
          return null
        }
      })
      
      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter((url): url is string => url !== null)
      
      // Save all images to database in parallel
      if (validUrls.length > 0) {
        const savePromises = validUrls.map(async (url) => {
          try {
            const response = await fetch('/api/admin/gallery', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_url: url }),
            })

            if (response.ok) {
              const data = await response.json()
              if (data.image) {
                setImages(prev => [{ ...data.image, type: 'standalone' }, ...prev])
                
                // Log upload (non-blocking)
                logActivity("Uploaded Gallery Image", { url: data.image.image_url }, "image", data.image.id).catch(console.error)
                
                return true
              }
            }
            return false
          } catch (error) {
            console.error('Failed to save image to database:', error)
            return false
          }
        })
        
        const saveResults = await Promise.all(savePromises)
        const successCount = saveResults.filter(Boolean).length

        if (successCount === filesToUpload.length) {
          toast.success("All images uploaded successfully")
        } else if (successCount > 0) {
          toast.warning(`Uploaded ${successCount} of ${filesToUpload.length} images`)
        } else {
          toast.error("Failed to upload images")
        }
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
              {images.map((image) => {
                // Use original image URL directly - thumbnails will be handled by Cloudflare Images variants
                // If thumbnail variant doesn't exist, the original will load
                const displayUrl = image.image_url || '';
                
                return (
                  <div
                    key={image.id}
                    className="group relative aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    {displayUrl ? (
                      <img
                        src={displayUrl}
                        alt={image.alt_text || 'Gallery image'}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Log error for debugging
                          const target = e.target as HTMLImageElement;
                          console.error('Image failed to load:', {
                            id: image.id,
                            url: displayUrl,
                            attemptedUrl: target.src
                          });
                          // Show placeholder on error
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.error-placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'error-placeholder w-full h-full flex items-center justify-center bg-muted';
                            placeholder.innerHTML = '<svg class="w-8 h-8 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                            parent.appendChild(placeholder);
                          }
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', displayUrl);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="size-8 text-muted-foreground/50" />
                      </div>
                    )}
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
                );
              })}
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
