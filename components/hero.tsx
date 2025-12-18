"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <section className="relative h-screen bg-black dark:bg-black overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-[1.3]"
          src="/images/Imagine Entertainment Commercial 30 Sec.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/dramatic-stage-lighting-corporate-event-dark-green.jpg"
          aria-label="Imagine Entertainment showreel"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 dark:from-black/50 dark:via-black/30 dark:to-black/60" />
      </div>

      {/* Content Overlay - Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-6 md:px-10 lg:px-12 pb-6 md:pb-8 lg:pb-13">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-end justify-between gap-6 md:gap-8">
          {/* Left Side - Text */}
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-0.5 text-white leading-tight">
              IMAGINE ENTERTAINMENT
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed">
              Sri Lanka's premier destination for immersive production and creative storytelling.
            </p>
          </div>

          {/* Right Side - Button */}
          <div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all rounded-full font-medium text-sm"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
