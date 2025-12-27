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

    const handleLoadedData = () => {
      setVideoReady(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)
    video.load()

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [])

  return (
    <section className="relative min-h-[100dvh] h-[100dvh] bg-black dark:bg-black overflow-hidden">
      {/* Background Video - same as CSS: transition-opacity duration-500 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
        <motion.video
          ref={videoRef}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 0.5 }} // Same as CSS duration-500
          className="absolute inset-0 w-full h-full object-cover scale-[1.3]"
          src="/Imagine Entertainment Commercial 30 Sec.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Imagine Entertainment showreel"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 dark:from-black/50 dark:via-black/30 dark:to-black/60" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 md:px-10 lg:px-12 pb-12 sm:pb-6 md:pb-8 lg:pb-13 hero-content-bottom">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4 sm:gap-6 md:gap-8">
          <div className="text-white flex-1 w-full md:w-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 text-white leading-tight tracking-tight">
              IMAGINE ENTERTAINMENT
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/80 max-w-2xl leading-relaxed">
              Imagine Entertainment creates unforgettable live experiences with end-to-end production. Spanning creative design, lighting, sound, LEDs, visuals, staging, rentals, and rigging, we ensure flawless execution to bring every concert, corporate event, or large-scale production to life.
            </p>
          </div>

          <motion.div 
            className="w-full md:w-auto flex md:block"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link
              href="/gallery"
              className="cursor-target inline-flex items-center justify-start md:justify-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:from-white/30 hover:to-white/20 hover:border-white/40 transition-all rounded-full font-semibold text-sm md:text-base shadow-lg hover:shadow-xl w-auto"
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
