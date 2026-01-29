"use client"

import LoadingSpinner from "./loading-spinner"

/**
 * Shared masonry-style skeleton loading component.
 * Matches Masonry breakpoints (2–5 columns) and 12px gap.
 * Use consistently across Gallery, Work page, and Work gallery.
 */
const SKELETON_HEIGHTS = [
  192, 256, 160, 224, 240, 176, 208, 272, 144, 288, 200, 232,
  168, 264, 184, 248,
] as const

export interface MasonrySkeletonProps {
  /** Minimum height of the skeleton container (e.g. "500px", "40vh") */
  minHeight?: string | number
  /** Number of skeleton items to show (default: all) */
  itemCount?: number
  /** Additional class names for the wrapper */
  className?: string
  /** Accessible busy state */
  ariaBusy?: boolean
  /** Show centered circle loading indicator (Loader2) over the skeleton while loading */
  showSpinner?: boolean
}

export default function MasonrySkeleton({
  minHeight = "500px",
  itemCount = SKELETON_HEIGHTS.length,
  className = "",
  ariaBusy = true,
  showSpinner = false,
}: MasonrySkeletonProps) {
  const heights = SKELETON_HEIGHTS.slice(0, itemCount)
  const minHeightStr = typeof minHeight === "number" ? `${minHeight}px` : minHeight

  const skeleton = (
    <div
      className={`masonry-skeleton w-full ${className}`.trim()}
      style={{ minHeight: minHeightStr }}
      aria-hidden="true"
      aria-busy={ariaBusy}
    >
      {heights.map((height, i) => (
        <div
          key={i}
          className="masonry-skeleton-item"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )

  if (!showSpinner) return skeleton

  return (
    <div className="relative w-full" style={{ minHeight: minHeightStr }}>
      {skeleton}
      <div
        className="absolute inset-0 flex items-center justify-center bg-background/60"
        aria-hidden="true"
      >
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}
