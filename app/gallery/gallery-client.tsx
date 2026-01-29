"use client"

import { useEffect, useState, useCallback } from "react"
import Masonry from "@/components/Masonry"
import { MasonrySkeleton } from "@/components/loading"

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

  const INITIAL_BATCH = 18
  const LOAD_MORE_BATCH = 12

  const [allImages] = useState<string[]>(initialImages)
  const [masonryItems, setMasonryItems] = useState<MasonryItem[]>([])
  const [dimensionsResolving, setDimensionsResolving] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

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

  // Resolve image dimensions for a slice (Pinterest-style: only resolve what we need)
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

  // Resolve only first batch so we don't load all images at once (Pinterest-style)
  useEffect(() => {
    if (initialImages.length === 0) {
      setMasonryItems([])
      setDimensionsResolving(false)
      return
    }
    let cancelled = false
    setDimensionsResolving(true)
    const firstBatch = initialImages.slice(0, INITIAL_BATCH)
    resolveItemsWithDimensions(firstBatch)
      .then((items) => {
        if (!cancelled) {
          setMasonryItems(items)
          setDimensionsResolving(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMasonryItems([])
          setDimensionsResolving(false)
        }
      })
    return () => { cancelled = true }
  }, [initialImages, resolveItemsWithDimensions])

  const loadMore = useCallback(async () => {
    if (loadingMore || masonryItems.length >= initialImages.length) return
    const start = masonryItems.length
    const batch = initialImages.slice(start, start + LOAD_MORE_BATCH)
    if (batch.length === 0) return
    setLoadingMore(true)
    try {
      const nextItems = await resolveItemsWithDimensions(batch)
      setMasonryItems((prev) => [...prev, ...nextItems])
    } finally {
      setLoadingMore(false)
    }
  }, [initialImages, masonryItems.length, loadingMore, resolveItemsWithDimensions])

  if (initialImages.length === 0) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">No images found in the gallery.</p>
      </div>
    )
  }

  // Show skeleton whenever we're loading or have no items yet (never show empty black area)
  const showSkeleton = dimensionsResolving || masonryItems.length === 0
  const showMasonry = masonryItems.length > 0

  return (
    <>
      <div className="min-h-[600px] w-full">
        {showSkeleton && (
          <MasonrySkeleton minHeight={500} ariaBusy={dimensionsResolving} showSpinner />
        )}
        {showMasonry && (
          <>
            <Masonry
              items={masonryItems}
              animateFrom="bottom"
              scaleOnHover={false}
              hoverScale={1}
              blurToFocus={false}
              colorShiftOnHover={false}
              stagger={0.02}
              initialBatchSize={INITIAL_BATCH}
              batchSize={LOAD_MORE_BATCH}
              onLoadMore={loadMore}
              hasMore={masonryItems.length < initialImages.length}
            />
            {masonryItems.length >= initialImages.length && (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground text-sm">All images loaded</p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
