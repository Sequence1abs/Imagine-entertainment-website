"use client"

import { useEffect, useState, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Masonry from "@/components/Masonry"

interface WorkGalleryProps {
  images: Array<{
    id: string
    image_url: string
    alt_text?: string
  }>
}

// Transform URL to use Cloudflare Images delivery domain
const transformUrl = (url: string, variant: 'public' | 'thumbnail' = 'public'): string => {
  if (!url || !url.trim()) return url
  
  // Convert custom domain to standard Cloudflare delivery domain
  let transformedUrl = url.replace('images.imaginesl.com', 'imagedelivery.net')
  
  // Only process Cloudflare Images URLs
  if (!transformedUrl.includes('imagedelivery.net')) {
    return url
  }
  
  // Ensure URL has variant suffix
  if (/\/(public|thumbnail|gallery|hero)$/.test(transformedUrl)) {
    // Replace with desired variant
    return transformedUrl.replace(/\/(public|thumbnail|gallery|hero)$/, `/${variant}`)
  } else {
    return transformedUrl.endsWith('/') 
      ? transformedUrl + variant 
      : transformedUrl + '/' + variant
  }
}

// Use public variant for both (guaranteed to exist)
// Note: If you configure 'thumbnail' variant in Cloudflare, you can use it for grid
const getGridImageUrl = (url: string) => transformUrl(url, 'public')
const getFullImageUrl = (url: string) => transformUrl(url, 'public')

export default function WorkGallery({ images }: WorkGalleryProps) {
  /* Masonry item type definition */
  type MasonryItem = {
    id: string
    img: string
    url?: string
    height: number
    loaded?: boolean
    originalUrl?: string // Store original for lightbox
  }

  const [masonryItems, setMasonryItems] = useState<MasonryItem[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Helper function to get image dimensions
  const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = () => {
        resolve({ width: 400, height: 300 }) // Default 4:3 fallback
      }
      img.decoding = 'async'
      img.src = src
    })
  }

  // Default height for skeleton (1:1 aspect ratio)
  const getDefaultHeight = () => 400

  // Load actual image dimensions and update the item
  const updateItemDimensions = useCallback(async (item: MasonryItem) => {
    try {
      const dimensions = await getImageDimensions(item.img)
      const aspectRatio = dimensions.height / dimensions.width
      const baseWidth = 400
      const calculatedHeight = baseWidth * aspectRatio
      
      setMasonryItems(prev => prev.map(p => {
        if (p.id === item.id) {
          return { ...p, height: calculatedHeight, loaded: true }
        }
        return p
      }))
    } catch {
      setMasonryItems(prev => prev.map(p => {
        if (p.id === item.id) return { ...p, loaded: true }
        return p
      }))
    }
  }, [])

  // Initialize items
  useEffect(() => {
    if (!images || images.length === 0) return

    // Deduplicate images by URL to prevent duplicate images in gallery
    const seenUrls = new Set<string>()
    const uniqueImages = images.filter((img) => {
      if (seenUrls.has(img.image_url)) {
        return false
      }
      seenUrls.add(img.image_url)
      return true
    })

    // Use gallery variant for faster grid loading
    const newItems: MasonryItem[] = uniqueImages.map((img, index) => ({
      id: `work-gallery-${img.id || index}`,
      img: getGridImageUrl(img.image_url), // Use optimized gallery variant
      originalUrl: img.image_url, // Keep original for lightbox
      height: getDefaultHeight(),
      loaded: false
    }))

    setMasonryItems(newItems)

    // Trigger dimension loading for all items
    newItems.forEach(item => {
      updateItemDimensions(item)
    })
  }, [images, updateItemDimensions])

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, images.length])

  const handleImageClick = useCallback((_item: any, index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }, [])

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <div className="min-h-[400px]">
        <Masonry
          items={masonryItems}
          animateFrom="bottom"
          scaleOnHover={false}
          hoverScale={1}
          blurToFocus={false}
          colorShiftOnHover={false}
          stagger={0.05}
          onItemClick={handleImageClick}
        />
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && images[currentIndex] && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm touch-none"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Preload adjacent images with full quality for instant navigation */}
          {images.length > 1 && (
            <>
              <link 
                rel="preload" 
                as="image" 
                href={getFullImageUrl(images[(currentIndex + 1) % images.length].image_url)} 
              />
              <link 
                rel="preload" 
                as="image" 
                href={getFullImageUrl(images[(currentIndex - 1 + images.length) % images.length].image_url)} 
              />
            </>
          )}
          
          {/* Close button - larger touch target on mobile */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 md:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 md:w-6 md:h-6" />
          </button>

          {/* Previous button - positioned for mobile touch */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-2 md:left-4 z-50 p-3 md:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}

          {/* Image container - using native img for instant full-quality loading */}
          <div 
            className="relative w-[90vw] h-[80vh] md:w-[85vw] md:h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getFullImageUrl(images[currentIndex].image_url)}
              alt={images[currentIndex].alt_text || `Gallery image ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>

          {/* Next button - positioned for mobile touch */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-2 md:right-4 z-50 p-3 md:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}

          {/* Image counter - positioned above bottom safe area on mobile */}
          {images.length > 1 && (
            <div className="absolute bottom-6 md:bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}

