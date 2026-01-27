"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Navigation from "@/components/navigation"

// Static nav shell shown on first paint so navigation is visible before hero
const NavShell = () => (
  <nav
    className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-black/0"
    aria-label="Main navigation"
  >
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/Imagine_logo_white_long.png"
          alt="Imagine Entertainment"
          className="h-[60px] md:h-[68px] w-[180px] md:w-[196px] object-contain object-left"
          width={196}
          height={68}
          fetchPriority="high"
        />
      </Link>
      <div className="hidden lg:flex items-center gap-12">
        <Link href="/about" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
          About
        </Link>
        <Link href="/work" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
          Work
        </Link>
        <Link href="/services" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
          Services
        </Link>
        <Link href="/contact" className="text-sm font-medium text-white/90 hover:text-white transition-colors">
          Contact
        </Link>
      </div>
    </div>
  </nav>
)

// Renders visible nav shell on first paint, then full Navigation after mount
export default function NavigationWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <NavShell />
  }

  return <Navigation />
}
