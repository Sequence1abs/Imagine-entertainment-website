"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function HydrationLoader() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    // Mark as hydrated once this effect runs (React has taken over)
    setIsHydrated(true)
    
    // Fade out the loader after a brief delay for smooth transition
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Don't show loader if already hydrated
  if (!showLoader) return null

  return (
    <AnimatePresence>
      {!isHydrated && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          {/* Subtle loading indicator */}
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 text-sm tracking-wider"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
