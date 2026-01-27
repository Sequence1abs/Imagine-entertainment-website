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

  // Default height for masonry items
  const getDefaultHeight = () => 400

  // Normalize URL for deduplication
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

  // Initialize items immediately from server-provided data
  useEffect(() => {
    if (initialImages.length === 0) return

    // Create items for initial batch
    const seenUrls = new Set<string>()
    const items: MasonryItem[] = []
    
    const imagesToShow = initialImages.slice(0, displayedCount)
    
    for (const url of imagesToShow) {
      const normalized = normalizeUrl(url)
      if (!seenUrls.has(normalized)) {
        seenUrls.add(normalized)
        const transformedUrl = getGridImageUrl(url)
        // Debug: log first few URLs to verify transformation
        if (items.length < 2) {
          console.log('[GalleryClient] Original URL:', url)
          console.log('[GalleryClient] Transformed URL:', transformedUrl)
        }
        items.push({
          id: `gallery-${normalized}`,
          img: transformedUrl,
          height: getDefaultHeight(),
          loaded: true
        })
      }
    }

    setMasonryItems(items)
    setHasMore(displayedCount < initialImages.length)
  }, [initialImages, displayedCount, normalizeUrl])

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
