"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen bg-white dark:bg-background overflow-hidden flex items-center">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/Imagine Entertainment Commercial 30 Sec.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/dramatic-stage-lighting-corporate-event-dark-green.jpg"
          aria-label="Imagine Entertainment showreel"
        />
        <div className="absolute inset-0 dark:bg-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 lg:px-12 py-20 md:py-32">
        <div className="max-w-3xl">
          <p
            className={`text-xs tracking-[0.3em] text-gray-500 dark:text-muted-foreground mb-6 uppercase transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            IMAGINE ENTERTAINMENT
          </p>

          <h1 className="mb-8">
            <span
              className={`inline-block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black dark:text-foreground leading-tight transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              We Create{" "}
            </span>
            <span
              className={`inline-block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold italic text-gray-600 dark:text-muted-foreground leading-tight transition-all duration-700 delay-150 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Extraordinary{" "}
            </span>
            <span
              className={`block text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black dark:text-foreground leading-tight transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Experiences
            </span>
          </h1>

          <p
            className={`text-base md:text-lg text-gray-600 dark:text-muted-foreground max-w-xl leading-relaxed mb-8 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Full-service event production for corporate events, television, film, and theatre. Creating moments that captivate worldwide.
          </p>

          {/* Links */}
          <div
            className={`flex items-center gap-8 mb-16 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/work"
              className="text-gray-700 dark:text-foreground hover:text-black dark:hover:text-foreground transition-colors flex items-center gap-2 text-base md:text-lg font-medium"
            >
              Explore Work
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 dark:text-foreground hover:text-black dark:hover:text-foreground transition-colors text-base md:text-lg font-medium"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
