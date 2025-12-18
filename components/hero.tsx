"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const clients = ["BBC", "Netflix", "Sky", "ITV", "Live Nation", "AEG"]

  return (
    <section className="relative min-h-screen bg-white dark:bg-background overflow-hidden flex items-center">
      {/* Circular Graphic on Right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] opacity-30 dark:opacity-10 pointer-events-none">
        <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-800" style={{ transform: 'scale(1)' }} />
        <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-800" style={{ transform: 'scale(0.75)' }} />
        <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-800" style={{ transform: 'scale(0.5)' }} />
        <div className="absolute inset-0 rounded-full border border-gray-200 dark:border-gray-800" style={{ transform: 'scale(0.25)' }} />
        <div 
          className="absolute inset-0 rounded-full" 
          style={{
            background: 'radial-gradient(circle, rgba(255, 237, 213, 0.2) 0%, transparent 70%)'
          }}
        />
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

          {/* Client Logos */}
          <div
            className={`flex items-center gap-8 md:gap-12 flex-wrap transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {clients.map((client) => (
              <span
                key={client}
                className="text-xs md:text-sm tracking-wider text-gray-400 dark:text-muted-foreground font-light"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
