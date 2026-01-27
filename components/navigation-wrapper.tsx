"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"

// Client-only wrapper for Navigation to prevent hydration mismatches
// Renders nothing on server, then mounts Navigation on client
export default function NavigationWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return a placeholder with same dimensions during SSR
  if (!mounted) {
    return <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20" />
  }

  return <Navigation />
}
