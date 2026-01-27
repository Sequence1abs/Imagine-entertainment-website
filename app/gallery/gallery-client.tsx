"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Masonry from "@/components/Masonry"

const LOAD_MORE_COUNT = 15

// Transform URL to use Cloudflare Images delivery domain
// Use 'public' variant which always exists (thumbnail/gallery may not be configured)
const getGridImageUrl = (url: string): string => {
  if (!url || !url.trim()) return url
  
  // Convert custom domain to standard Cloudflare delivery domain
  let transformedUrl = url.replace('images.imaginesl.com', 'imagedelivery.net')
  
  // Only process Cloudflare Images URLs
  if (!transformedUrl.includes('imagedelivery.net')) {
    return url
  }
  
  // Ensure URL has /public variant (guaranteed to exist)
  if (/\/(public|thumbnail|gallery|hero)$/.test(transformedUrl)) {
    // Keep existing variant (public is safest)
    return transformedUrl
  } else {
    // No variant found, add /public
    return transformedUrl.endsWith('/') 
      ? transformedUrl + 'public' 
      : transformedUrl + '/public'
  }
}

interface GalleryClientProps {
  initialImages: string[]
}

// Base width used by Masonry for aspect-ratio calculation (must match Masonry.tsx)
const MASONRY_BASE_WIDTH = 400

function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      resolve({ width: MASONRY_BASE_WIDTH, height: 300 })
    }
    img.decoding = "async"
    img.src = src
  })
}

export default function GalleryClient({ initialImages }: GalleryClientProps) {
  type MasonryItem = {
    id: string
    img: string
    height: number
    loaded?: boolean
  }

  const [allImages] = useState<string[]>(initialImages)
  const [allItems, setAllItems] = useState<MasonryItem[]>([])
  const [masonryItems, setMasonryItems] = useState<MasonryItem[]>([])
  const [dimensionsResolving, setDimensionsResolving] = useState(true)
  const [displayedCount, setDisplayedCount] = useState(20)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const normalizeUrl = useCallback((url: string): string => {
    if (!url) return ''
    try {
      const urlObj = new URL(url)
      let pathname = urlObj.pathname
      pathname = pathname.replace(/\/(public|gallery|thumbnail|hero)$/, '')
      return `${urlObj.protocol}//${urlObj.host}${pathname}`.replace(/\/$/, '')
    } catch {
      return url.replace(/\/(public|gallery|thumbnail|hero)(\/|$)/, '/').trim().replace(/\/$/, '')
    }
  }, [])

  // Resolve all image dimensions for the current slice before ever rendering Masonry
  const resolveItemsWithDimensions = useCallback(
    async (urls: string[]): Promise<MasonryItem[]> => {
      const seenUrls = new Set<string>()
      const unique: { id: string; img: string }[] = []
      for (const url of urls) {
        const normalized = normalizeUrl(url)
        if (!seenUrls.has(normalized)) {
          seenUrls.add(normalized)
          unique.push({ id: `gallery-${normalized}`, img: getGridImageUrl(url) })
        }
      }
      const withHeights = await Promise.all(
        unique.map(async (item) => {
          try {
            const dims = await getImageDimensions(item.img)
            const aspectRatio = dims.height / dims.width
            const height = MASONRY_BASE_WIDTH * aspectRatio
            return { ...item, height, loaded: true } as MasonryItem
          } catch {
            return { ...item, height: MASONRY_BASE_WIDTH, loaded: true } as MasonryItem
          }
        })
      )
      return withHeights
    },
    [normalizeUrl]
  )

  // Resolve all image dimensions once up front so Masonry always receives final heights
  useEffect(() => {
    if (initialImages.length === 0) {
      setAllItems([])
      setMasonryItems([])
      setHasMore(false)
      setDimensionsResolving(false)
      return
    }
    let cancelled = false
    setDimensionsResolving(true)
    resolveItemsWithDimensions(initialImages).then((items) => {
      if (!cancelled) {
        setAllItems(items)
        setDimensionsResolving(false)
      }
    })
    return () => { cancelled = true }
  }, [initialImages, resolveItemsWithDimensions])

  // Derive currently visible masonry items from the fully-dimensioned list
  useEffect(() => {
    if (allItems.length === 0) {
      setMasonryItems([])
      setHasMore(false)
      return
    }
    const next = allItems.slice(0, Math.min(displayedCount, allItems.length))
    setMasonryItems(next)
    setHasMore(next.length < allItems.length)
  }, [allItems, displayedCount])

  // Load more images
  const loadMore = useCallback(() => {
    if (displayedCount >= allItems.length) {
      setHasMore(false)
      return
    }
    setDisplayedCount(prev => Math.min(prev + LOAD_MORE_COUNT, allItems.length))
  }, [displayedCount, allItems.length])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const currentTarget = observerTarget.current
    if (!currentTarget || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    )

    observer.observe(currentTarget)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  if (initialImages.length === 0) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">No images found in the gallery.</p>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-[600px]">
        {dimensionsResolving ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" aria-hidden="true">
            {Array.from({ length: Math.min(displayedCount, 12) }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="rounded-xl bg-muted/40 animate-pulse"
                style={{ aspectRatio: i % 3 === 0 ? '3/4' : i % 3 === 1 ? '1' : '4/3', minHeight: 120 }}
              />
            ))}
          </div>
        ) : masonryItems.length > 0 ? (
          <Masonry
            items={masonryItems}
            animateFrom="bottom"
            scaleOnHover={false}
            hoverScale={1}
            blurToFocus={false}
            colorShiftOnHover={false}
            stagger={0.02}
          />
        ) : null}
      </div>
      
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
  )
}
