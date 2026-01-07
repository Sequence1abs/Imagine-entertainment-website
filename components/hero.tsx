"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setVideoReady(true)
      video.play().catch(() => {
        setVideoReady(true)
      })
    }

    video.addEventListener('canplaythrough', handleCanPlay)
    video.load()

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [])

  // Cloudinary video URL
  const videoUrl = "https://res.cloudinary.com/dqhklh9nd/video/upload/q_auto:eco,f_auto/v1767202328/Final_Web_vyhf3y.mp4"

  return (
    <section className="relative min-h-dvh h-dvh bg-black overflow-hidden">
      
      {/* Video - Fades in when ready */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-label="Imagine Entertainment showreel"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 md:px-10 lg:px-12 pb-12 sm:pb-6 md:pb-8 lg:pb-13">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 md:gap-8">
          <div className="text-white flex-1 w-full md:w-auto">
            {/* Title Animation - Keep this for visual impact */}
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              IMAGINE ENTERTAINMENT
            </motion.h1>
            
            {/* Description Animation */}
            <motion.p 
              className="text-xs sm:text-sm md:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Imagine Entertainment creates unforgettable live experiences with end-to-end production. Spanning creative design, lighting, sound, LEDs, visuals, staging, rentals, and rigging, we ensure flawless execution to bring every concert, corporate event, or large-scale production to life.
            </motion.p>
          </div>

          {/* CTA Button - Simplified animation */}
          <motion.div 
            className="w-full md:w-auto flex md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Link
              href="/gallery"
              className="cursor-target inline-flex items-center justify-start md:justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-white/15 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/25 hover:border-white/40 transition-all duration-200 rounded-full font-semibold text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] w-auto"
            >
              View Our Work
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
