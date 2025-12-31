"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function ExpertiseSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const services = [
    "Creative Direction",
    "Technical Production",
    "Event Management",
    "Audio & Video",
    "Lighting Design",
    "Staging & Scenic",
  ]

  const industries = [
    "Corporate",
    "Television & Film",
    "Theatre",
    "Fashion",
    "Music & Live",
    "Automotive",
  ]

  return (
    <section ref={ref} className="py-16 md:py-20 bg-muted mx-4 md:mx-6 rounded-2xl">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
        <p 
          className={`text-muted-foreground text-xs tracking-[0.2em] mb-4 font-medium uppercase transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          //Why Choose Us
        </p>
        
        <h2 
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.15] mb-4 tracking-tight transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "0.1s" }}
        >
          One Vision. One Team.
          <br />
          <span className="text-muted-foreground italic font-normal">One Flawless Event.</span>
        </h2>
        
        <p 
          className={`text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto text-sm md:text-base transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          At Imagine Entertainment, a single, seasoned team of producers, directors, and technicians brings your ideas to life from concept to execution. With our full-service, cross-functional crew working side by side under one roof, you get one accountable partner delivering seamless, unforgettable experiences.
        </p>
        
        <div 
          className={`mb-10 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          <Link
            href="/contact"
            className="cursor-target inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-all shadow-md hover:shadow-lg"
          >
            Start Your Project
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div 
          className={`flex flex-col md:flex-row justify-center gap-6 md:gap-10 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "0.4s" }}
        >
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3 font-medium uppercase">
              Services
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {services.map((item, index) => (
                <span 
                  key={item} 
                  className={`px-3 py-1.5 rounded-full bg-background/50 dark:bg-background/30 text-xs font-medium text-foreground/80 border border-border/40 transition-all duration-500 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${0.5 + index * 0.05}s` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-px bg-border/30 self-stretch" />

          <div className="flex flex-col items-center">
            <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3 font-medium uppercase">
              Industries
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {industries.map((item, index) => (
                <span 
                  key={item} 
                  className={`px-3 py-1.5 rounded-full bg-background/50 dark:bg-background/30 text-xs font-medium text-foreground/80 border border-border/40 transition-all duration-500 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${0.6 + index * 0.05}s` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
