'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Image as ImageIcon, Upload, X, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  // Fetch images
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/admin/gallery')
        if (response.ok) {
          const data = await response.json()
          setImages(data.images || [])
        }
      } catch (error) {
        console.error('Error fetching images:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchImages()
  }, [])

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  // Remove selected file
  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Upload to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'imagine_events')
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) return null
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )
      
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Error uploading:', error)
      return null
    }
  }

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    
    try {
      for (const file of selectedFiles) {
        const url = await uploadToCloudinary(file)
        if (url) {
          const response = await fetch('/api/admin/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image_url: url }),
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.image) {
              setImages(prev => [{ ...data.image, type: 'standalone' }, ...prev])
            }
          }
        }
      }
      
      // Reset
      previews.forEach(p => URL.revokeObjectURL(p))
      setSelectedFiles([])
      setPreviews([])
      setShowUploadModal(false)
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
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
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="size-4 mr-2" />
          Upload Images
        </Button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upload to Gallery</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="size-5" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Upload standalone images directly to the gallery (not tied to any event)
            </p>

            {/* Preview Grid */}
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image src={preview} alt="" fill className="object-cover" />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 bg-black/50 rounded-full"
                    >
                      <X className="size-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Drop Zone */}
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors mb-4">
              <Upload className="size-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Click or drag images to upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowUploadModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading} className="flex-1">
                {isUploading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  `Upload ${selectedFiles.length} Image${selectedFiles.length !== 1 ? 's' : ''}`
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square bg-muted rounded-lg overflow-hidden"
            >
              <Image
                src={image.image_url}
                alt={image.alt_text || 'Gallery image'}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    image.type === 'event' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {image.type === 'event' ? 'Event' : 'Gallery'}
                  </span>
                </div>
                {image.event_title && (
                  <p className="text-white text-sm truncate">{image.event_title}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <ImageIcon className="size-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">No images yet</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Upload images directly or add them through events
          </p>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="size-4 mr-2" />
            Upload Images
          </Button>
        </div>
      )}
    </div>
  )
}
