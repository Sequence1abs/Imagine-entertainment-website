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
  const [masonryItems, setMasonryItems] = useState<MasonryItem[]>([])
  const [displayedCount, setDisplayedCount] = useState(20)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  const getDefaultHeight = () => MASONRY_BASE_WIDTH

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

  // Load all image dimensions in one batch to avoid N reflows and masonry stacking bugs
  const loadAllDimensions = useCallback(async (items: MasonryItem[]) => {
    const results = await Promise.all(
      items.map(async (item) => {
        try {
          const dims = await getImageDimensions(item.img)
          const aspectRatio = dims.height / dims.width
          const height = MASONRY_BASE_WIDTH * aspectRatio
          return { id: item.id, height }
        } catch {
          return { id: item.id, height: MASONRY_BASE_WIDTH }
        }
      })
    )
    const byId = Object.fromEntries(results.map((r) => [r.id, r.height]))
    setMasonryItems((prev) => {
      if (prev.length !== items.length || items.some((it, i) => prev[i]?.id !== it.id)) return prev
      return prev.map((p) => (byId[p.id] != null ? { ...p, height: byId[p.id], loaded: true } : p))
    })
  }, [])

  // Initialize items and load real image dimensions in one batch (avoids stacking/resize bugs)
  useEffect(() => {
    if (initialImages.length === 0) return

    const seenUrls = new Set<string>()
    const items: MasonryItem[] = []
    const imagesToShow = initialImages.slice(0, displayedCount)

    for (const url of imagesToShow) {
      const normalized = normalizeUrl(url)
      if (!seenUrls.has(normalized)) {
        seenUrls.add(normalized)
        const transformedUrl = getGridImageUrl(url)
        items.push({
          id: `gallery-${normalized}`,
          img: transformedUrl,
          height: getDefaultHeight(),
          loaded: false
        })
      }
    }

    setMasonryItems(items)
    setHasMore(displayedCount < initialImages.length)
    loadAllDimensions(items)
  }, [initialImages, displayedCount, normalizeUrl, loadAllDimensions])

  // Load more images
  const loadMore = useCallback(() => {
    if (displayedCount >= allImages.length) {
      setHasMore(false)
      return
    }
    setDisplayedCount(prev => Math.min(prev + LOAD_MORE_COUNT, allImages.length))
  }, [displayedCount, allImages.length])

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
        <Masonry
          items={masonryItems}
          animateFrom="bottom"
          scaleOnHover={false}
          hoverScale={1}
          blurToFocus={false}
          colorShiftOnHover={false}
          stagger={0.02}
        />
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
