"use client"

import { useEffect, useState } from "react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <section className="relative min-h-screen bg-[#0a1f1a] text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/dramatic-stage-lighting-corporate-event-dark-green.jpg"
          alt="Event Production"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f1a]/90 via-[#0a1f1a]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <div className="max-w-3xl">
          <p
            className={`text-xs tracking-[0.3em] text-white/60 mb-6 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            IMAGINE ENTERTAINMENT
          </p>

          <h1 className="mb-8">
            <span
              className={`block text-4xl md:text-5xl lg:text-6xl font-medium leading-tight transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              We Create Extraordinary
            </span>
            <span
              className={`block text-4xl md:text-5xl lg:text-6xl font-medium leading-tight transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Experiences <span className="font-serif italic text-white/80">For</span> Corporate
            </span>
            <span
              className={`block text-4xl md:text-5xl lg:text-6xl font-medium leading-tight transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              & Entertainment Brands.
            </span>
          </h1>

          <p
            className={`text-base md:text-lg text-white/70 max-w-xl leading-relaxed mb-8 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Full-service event production specializing in corporate events, television, film, and theatre. We
            meticulously plan, design, and execute experiences that captivate audiences.
          </p>
        </div>
      </div>

      {/* Bottom Navigation Hints */}
      <div
        className={`absolute bottom-8 left-6 lg:left-12 right-6 lg:right-12 flex justify-between items-end transition-all duration-700 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="hidden md:flex gap-12 text-xs text-white/50">
          <span>London</span>
          <span>Global</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>Scroll</span>
          <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center animate-bounce">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
