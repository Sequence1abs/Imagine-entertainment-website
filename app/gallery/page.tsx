"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Masonry from "@/components/Masonry"

const INITIAL_LOAD_COUNT = 20 // Load 20 images initially
const LOAD_MORE_COUNT = 15 // Load 15 more images each time

// Helper function to get image dimensions
const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      // Default aspect ratio if image fails to load
      resolve({ width: 1200, height: 1600 })
    }
    img.src = src
  })
}

export default function GalleryPage() {
  const [allImages, setAllImages] = useState<string[]>([])
  const [masonryItems, setMasonryItems] = useState<
    Array<{ id: string; img: string; url?: string; height: number }>
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const currentIndexRef = useRef(0)
  const observerTarget = useRef<HTMLDivElement>(null)
  const itemIdCounter = useRef(0)

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Load images with dimensions
  const loadImageItems = useCallback(async (imageSources: string[]) => {
    const items = await Promise.all(
      imageSources.map(async (src: string) => {
        const dimensions = await getImageDimensions(src)
        const aspectRatio = dimensions.height / dimensions.width
        const baseWidth = 400
        const calculatedHeight = baseWidth * aspectRatio

        return {
          id: `gallery-item-${itemIdCounter.current++}-${src}`,
          img: src,
          height: calculatedHeight,
        }
      })
    )
    return items
  }, [])

  // Initial load
  useEffect(() => {
    const loadInitialImages = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/gallery')
        const data = await response.json()
        
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          // Ensure images are strings and filter out invalid entries
          const imageStrings: string[] = data.images.filter((img: unknown): img is string => typeof img === 'string')
          
          if (imageStrings.length > 0) {
            // Shuffle all images
            const shuffledImages = shuffleArray(imageStrings)
            setAllImages(shuffledImages)
            
            // Load initial batch
            const initialBatch = shuffledImages.slice(0, INITIAL_LOAD_COUNT)
            currentIndexRef.current = INITIAL_LOAD_COUNT
            setHasMore(shuffledImages.length > INITIAL_LOAD_COUNT)
            
            // Load dimensions for initial batch
            const items = await loadImageItems(initialBatch)
            setMasonryItems(items)
          }
        }
      } catch (error) {
        console.error('Error loading images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialImages()
  }, [loadImageItems])

  // Load more images when scrolling
  const loadMoreImages = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    
    try {
      const currentIndex = currentIndexRef.current
      const images = allImages
      
      if (currentIndex >= images.length) {
        setHasMore(false)
        setIsLoadingMore(false)
        return
      }
      
      const nextBatch = images.slice(currentIndex, currentIndex + LOAD_MORE_COUNT)
      
      if (nextBatch.length > 0) {
        // Update index immediately
        currentIndexRef.current = currentIndex + nextBatch.length
        setHasMore(currentIndexRef.current < images.length)
        
        // Load dimensions for new batch
        const newItems = await loadImageItems(nextBatch)
        setMasonryItems(prevItems => [...prevItems, ...newItems])
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more images:', error)
      setHasMore(false)
    } finally {
      setIsLoadingMore(false)
    }
  }, [allImages, isLoadingMore, hasMore, loadImageItems])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentTarget = observerTarget.current
    if (!currentTarget || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && hasMore && !isLoadingMore) {
            loadMoreImages()
          }
        })
      },
      { 
        threshold: 0.01,
        rootMargin: '600px' // Start loading 600px before reaching the target for faster loading
      }
    )

    observer.observe(currentTarget)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoadingMore, loadMoreImages])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="pt-28 pb-12 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="max-w-3xl mb-10">
          <p className="text-xs tracking-[0.15em] text-muted-foreground mb-3">//Gallery</p>
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Visual Highlights</h1>
          <p className="text-muted-foreground">
            A Pinterest-style wall of recent stages, shows, and experiences we've delivered.
          </p>
        </div>

        {isLoading ? (
          <div className="min-h-[600px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : masonryItems.length > 0 ? (
          <>
            <div className="min-h-[600px]">
              <Masonry
                items={masonryItems}
                animateFrom="bottom"
                scaleOnHover={true}
                hoverScale={0.98}
                blurToFocus={true}
                colorShiftOnHover={false}
                stagger={0.03}
              />
            </div>
            {/* Intersection Observer target for infinite scroll */}
            {hasMore && (
              <div 
                ref={observerTarget} 
                className="flex items-center justify-center py-8 min-h-[200px] w-full"
                aria-label="Load more images"
              >
                {isLoadingMore && (
                  <p className="text-muted-foreground">Loading more images...</p>
                )}
              </div>
            )}
            {!hasMore && masonryItems.length > 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">All images loaded</p>
            </div>
            )}
          </>
        ) : (
          <div className="min-h-[600px] flex items-center justify-center">
            <p className="text-muted-foreground">No images found in the gallery.</p>
        </div>
        )}
      </section>
    </main>
  )
}

