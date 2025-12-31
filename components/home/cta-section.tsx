"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

export function CTASection() {
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
    <section ref={ref} className="relative h-[45vh] md:h-[60vh] overflow-hidden mx-4 md:mx-6 rounded-2xl">
      <Image
        src="/dramatic-concert-stage-lighting-dark-atmospheric-p.jpg"
        alt="Let's talk"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 100vw"
      />
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white dark:text-white px-6">
          <p 
            className={`text-sm tracking-[0.2em] mb-4 text-white/70 dark:text-white/80 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            READY TO CREATE?
          </p>
          <div 
            className={`transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "0.15s" }}
          >
            <Link 
              href="/contact" 
              className="cursor-target group inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all rounded-full"
            >
              <span className="text-xl md:text-2xl font-medium text-white dark:text-white">Let's Talk</span>
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
