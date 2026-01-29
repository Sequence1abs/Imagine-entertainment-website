"use client"

import { Loader2 } from "lucide-react"

/**
 * Circle loading indicator used across the project (Loader2 + animate-spin).
 * Matches dashboard, auth, and other pages.
 */
export interface LoadingSpinnerProps {
  /** Size: "sm" | "md" | "lg" (default: "lg" for page-level loading) */
  size?: "sm" | "md" | "lg"
  /** Optional label for screen readers / visible text below */
  label?: string
  className?: string
}

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const

export default function LoadingSpinner({
  size = "lg",
  label,
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`.trim()}>
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-muted-foreground`}
        aria-hidden={!!label}
      />
      {label && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {label}
        </p>
      )}
    </div>
  )
}
