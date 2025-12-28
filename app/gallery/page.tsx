"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Masonry from "@/components/Masonry"
import PublicLayout from "@/components/layouts/public-layout"

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
  /* Masonry item type definition */
  type MasonryItem = {
    id: string
    img: string
    url?: string
    height: number
    loaded?: boolean
  }

  const [allImages, setAllImages] = useState<string[]>([])
  const [masonryItems, setMasonryItems] = useState<MasonryItem[]>([])
  const [initialLoaded, setInitialLoaded] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  const currentIndexRef = useRef(0)
  const observerTarget = useRef<HTMLDivElement>(null)
  const itemIdCounter = useRef(0)
  const processedImages = useRef<Set<string>>(new Set())

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Generate a random height for the skeleton (to create the masonry layout effect immediately)
  const getRandomHeight = () => {
    const ratios = [0.75, 1, 1.25, 1.5] // 4:3, 1:1, 4:5, 2:3
    const ratio = ratios[Math.floor(Math.random() * ratios.length)]
    const baseWidth = 400
    return baseWidth * ratio
  }

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
    } catch (e) {
      // If error, just mark as loaded so skeleton disappears (or keep default random height)
      setMasonryItems(prev => prev.map(p => {
        if (p.id === item.id) return { ...p, loaded: true }
        return p
      }))
    }
  }, [])

  // Add items with placeholder heights immediately, then load real dimensions
  const addItems = useCallback((imageSources: string[]) => {
    const newItems: MasonryItem[] = imageSources.map(src => ({
      id: `gallery-item-${itemIdCounter.current++}-${src}`,
      img: src,
      height: getRandomHeight(), // Random height for skeleton
      loaded: false
    }))

    setMasonryItems(prev => [...prev, ...newItems])

    // Trigger dimension loading in background
    newItems.forEach(item => {
      updateItemDimensions(item)
    })
  }, [updateItemDimensions])

  // Initial load
  useEffect(() => {
    const loadInitialImages = async () => {
      try {
        const response = await fetch('/api/gallery')
        const data = await response.json()
        
        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          const imageStrings: string[] = data.images.filter((img: unknown): img is string => typeof img === 'string')
          
          if (imageStrings.length > 0) {
            const shuffledImages = shuffleArray(imageStrings)
            setAllImages(shuffledImages)
            
            // Load initial batch
            const initialBatch = shuffledImages.slice(0, INITIAL_LOAD_COUNT)
            currentIndexRef.current = INITIAL_LOAD_COUNT
            setHasMore(shuffledImages.length > INITIAL_LOAD_COUNT)
            
            addItems(initialBatch)
            setInitialLoaded(true)
          } else {
             setInitialLoaded(true)
          }
        } else {
          setInitialLoaded(true)
        }
      } catch (error) {
        console.error('Error loading images:', error)
        setInitialLoaded(true)
      }
    }

    loadInitialImages()
  }, [addItems])

  // Load more images when scrolling
  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    
    // Small delay to prevent thrashing if observer fires too quickly
    setTimeout(() => {
      const currentIndex = currentIndexRef.current
      const images = allImages
      
      if (currentIndex >= images.length) {
        setHasMore(false)
        setIsLoadingMore(false)
        return
      }
      
      const nextBatch = images.slice(currentIndex, currentIndex + LOAD_MORE_COUNT)
      
      if (nextBatch.length > 0) {
        currentIndexRef.current = currentIndex + nextBatch.length
        addItems(nextBatch)
        setHasMore(currentIndexRef.current < images.length)
      } else {
        setHasMore(false)
      }
      setIsLoadingMore(false)
    }, 100)
  }, [allImages, isLoadingMore, hasMore, addItems])

  // Intersection Observer
  useEffect(() => {
    const currentTarget = observerTarget.current
    if (!currentTarget || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '400px' // Preload before reaching bottom
      }
    )

    observer.observe(currentTarget)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoadingMore, loadMore])

  return (
    <PublicLayout>
    <main className="min-h-screen bg-background text-foreground">
      <section className="pt-28 pb-12 px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="max-w-[1400px] mx-auto mb-10 md:mb-16">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
            <div>
              <div className="overflow-hidden mb-3">
                <p className="text-muted-foreground text-xs tracking-[0.15em] transition-all duration-700 translate-y-0 opacity-100">
                  OUR GALLERY
                </p>
              </div>
              <h1 className="overflow-hidden pb-2">
                <span className="block text-4xl md:text-5xl lg:text-6xl font-medium leading-tight transition-all duration-700 translate-y-0 opacity-100" style={{ transitionDelay: "0.15s" }}>
                  Visual <span className="italic font-normal text-muted-foreground">Highlights</span>
                </span>
              </h1>
            </div>

            <div className="lg:self-end transition-all duration-700 translate-y-0 opacity-100" style={{ transitionDelay: "0.3s" }}>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                A curated collection of recent stages, shows, and extraordinary experiences we've delivered across the globe.
              </p>
            </div>
          </div>
        </div>

        {initialLoaded && masonryItems.length === 0 ? (
          <div className="min-h-[600px] flex items-center justify-center">
            <p className="text-muted-foreground">No images found in the gallery.</p>
          </div>
        ) : (
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
            
            {/* Observer target */}
            {hasMore && (
              <div 
                ref={observerTarget} 
                className="flex items-center justify-center py-12 w-full h-20"
                aria-hidden="true"
              />
            )}
            
            {!hasMore && masonryItems.length > 0 && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">All images loaded</p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
    </PublicLayout>
  )
}

