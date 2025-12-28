"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Cookie } from "lucide-react"

export function CookieConsent() {
  // Start hidden to avoid hydration mismatch, check on mount
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      // Small delay for better UX (don't slam them immediately)
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem("cookie_consent", "true")
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem("cookie_consent", "false")
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 z-[100] w-full md:bottom-8 md:right-8 md:left-auto md:max-w-sm"
        >
          <div className="relative overflow-hidden rounded-t-xl border-t border-border bg-background/80 p-6 shadow-2xl backdrop-blur-xl md:rounded-xl md:border">
            
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cookie className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium leading-none text-foreground">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use cookies to enhance your browsing experience and analyze our traffic.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={accept}
                  className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Accept All
                </button>
                <button 
                  onClick={decline}
                  className="flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Decline
                </button>
              </div>
            </div>

            <button
              onClick={decline}
              className="absolute top-4 right-4 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

