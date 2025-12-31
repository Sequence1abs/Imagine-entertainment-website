"use client"

import { useEffect, useState, useRef } from "react"

export function StatementReveal() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.3 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="h-px w-10 bg-border" />
        <span className="text-muted-foreground text-xs tracking-[0.2em]">PHILOSOPHY</span>
        <div className="h-px w-10 bg-border" />
      </div>

      <p
        className={`text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "0.15s" }}
      >
        Every great experience starts with a story. We partner with you to shape that story-from imagination to impact-creating moments people remember.
      </p>
    </div>
  )
}
