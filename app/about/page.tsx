"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Footer from "@/components/footer"
import PublicLayout from "@/components/layouts/public-layout"

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <PublicLayout>
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] bg-foreground dark:bg-black text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img
            src="/professional-event-production-team-working-stage-s.jpg"
            alt="Team at work"
            className="w-full h-full object-cover opacity-40 dark:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/40 dark:from-black/90 dark:via-black/70 dark:to-black/50" />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-end">
            <div>
              <div className="overflow-hidden mb-3">
                <p
                  className={`text-white/50 dark:text-white/70 text-xs tracking-[0.15em] transition-all duration-700 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  IMAGINE ENTERTAINMENT
                </p>
              </div>

              <h1>
                <div className="overflow-hidden">
                  <span
                    className={`block text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-white dark:text-white transition-all duration-700 ${
                      isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
                    style={{ transitionDelay: "0.15s" }}
                  >
                    About <span className="italic font-normal text-white/70">Us</span>
                  </span>
                </div>
              </h1>
            </div>

            <div
              className={`lg:self-end transition-all duration-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              <p className="text-base md:text-lg text-white/70 dark:text-white/80 leading-relaxed max-w-md">
                A team of creative producers, technical directors, and event specialists delivering extraordinary
                experiences worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Oversized Typography */}
      <section className="py-20 md:py-28 lg:py-36 px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative">
          {/* Background Text */}
          <div className="absolute -top-20 left-0 right-0 text-[12rem] md:text-[18rem] lg:text-[24rem] font-bold text-foreground/[0.02] dark:text-white/[0.02] leading-none select-none pointer-events-none whitespace-nowrap">
            IMAGINE
          </div>
          
          <div className="relative z-10">
            {/* Build More With - Top */}
            <AnimatedLabel />
            {/* LESS STRESS - Offset to the right like original */}
            <div className="lg:ml-[25%]">
              <AnimatedHeadline />
            </div>
            {/* Description */}
            <SupportingText />
          </div>
        </div>
      </section>

      {/* Leadership Section - Zeit Media Style with Background Text */}
      <section className="pt-0 pb-16 md:pb-20 lg:pb-24 px-6 md:px-10 relative overflow-hidden">
        {/* Massive Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] md:text-[14rem] lg:text-[20rem] font-bold text-foreground/[0.03] dark:text-white/[0.03] leading-none select-none pointer-events-none whitespace-nowrap">
          FOUNDERS
        </div>

        <LeadershipSection />
      </section>

      {/* Stats Section - Bento Grid */}
      <AboutStatsSection />

      {/* Team Section */}
      <TeamSection />

      <Footer />
    </main>
    </PublicLayout>
  )
}

function AnimatedLabel() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 mb-4 md:mb-6 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <h3 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight">Build More With</h3>
    </div>
  )
}

function AnimatedHeadline() {
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
    <div ref={ref}>
      <h2 className="text-6xl md:text-8xl lg:text-[10rem] xl:text-[12rem] font-bold leading-[0.85] tracking-tighter">
        {["LESS", "STRESS"].map((word, i) => (
          <div key={word} className="overflow-hidden">
            <span
              className={`block transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
              }`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {word}
            </span>
          </div>
        ))}
      </h2>
    </div>
  )
}

function SupportingText() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`mt-12 md:mt-16 lg:mt-20 max-w-2xl lg:ml-auto transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: "0.3s" }}
    >
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        We handle the complexity so you can focus on what matters. Our end-to-end production expertise means seamless
        events, delivered on time, every time.
      </p>
    </div>
  )
}

function LeadershipSection() {
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

  return (
    <div ref={ref} className="max-w-[1400px] mx-auto relative z-10">
      {/* Header */}
      <div 
        className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">The Minds Behind the Experience</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
          Meet Our <span className="italic font-light text-muted-foreground">Founders</span>
        </h2>
      </div>

      {/* Floating Cards Grid */}
      <div className="grid md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
        {/* Founder 1 */}
        <div 
          className={`group transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "0.15s" }}
        >
          {/* Image - Grayscale to Color on Hover */}
          <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-lg">
            <img
              src="/professional-event-production-team-working-stage-s.jpg"
              alt="Mr. Sajith Morawaka Kodikara"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          
          {/* Info */}
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Managing Director</p>
          <h3 className="text-2xl md:text-3xl font-bold">
            Sajith Morawaka <span className="font-light text-muted-foreground">Kodikara</span>
          </h3>
        </div>

        {/* Founder 2 */}
        <div 
          className={`group md:mt-16 lg:mt-24 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          {/* Image - Grayscale to Color on Hover */}
          <div className="relative aspect-[3/4] mb-8 overflow-hidden rounded-lg">
            <img
              src="/creative-team-meeting-modern-office-collaboration-e.jpg"
              alt="Mr. Sandun Morawaka Kodikara"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          
          {/* Info */}
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase mb-2">Director</p>
          <h3 className="text-2xl md:text-3xl font-bold">
            Sandun Morawaka <span className="font-light text-muted-foreground">Kodikara</span>
          </h3>
        </div>
      </div>

      {/* Description - Centered below cards */}
      <div 
        className={`mt-12 md:mt-16 max-w-3xl mx-auto text-center transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "0.45s" }}
      >
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
          With over 37 years of experience in the events and entertainment industry, our founders have shaped Imagine Entertainment into a premier full-service production company. Their vision, expertise, and dedication continue to drive creativity, innovation, and flawless execution in every event we produce.
        </p>
      </div>
    </div>
  )
}

function StatCounter({ stat, index }: { stat: { number: string; label: string; description?: string }; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <p className="text-5xl md:text-6xl lg:text-7xl font-medium mb-2">{stat.number}</p>
      <p className="text-sm md:text-base font-medium mb-1">{stat.label}</p>
      {stat.description && (
        <p className="text-xs md:text-sm text-muted-foreground">{stat.description}</p>
      )}
    </div>
  )
}

function TeamSection() {
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

  return (
    <section ref={ref} className="pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-10 lg:pb-12">
      {/* Header */}
      <div 
        className={`text-center mb-12 md:mb-16 px-6 md:px-10 transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">Our Team</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
          The <span className="italic font-light text-muted-foreground">Creators</span>
        </h2>
      </div>
      
      {/* Team Image - Same margins as stats section */}
      <div 
        className={`mx-4 md:mx-6 rounded-2xl overflow-hidden transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
        style={{ transitionDelay: "0.15s" }}
      >
        <div className="relative h-[70vh] md:h-[80vh]">
          <img
            src="/creative-team-meeting-modern-office-collaboration-e.jpg"
            alt="Our Team"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}

function AboutStatsSection() {
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

  return (
    <section ref={ref} className="pt-16 md:pt-20 lg:pt-24 pb-6 md:pb-8 px-6 md:px-8 mx-4 md:mx-6 rounded-3xl bg-stone-100 dark:bg-zinc-950 text-foreground dark:text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div 
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div>
            <p className="text-muted-foreground dark:text-white/40 text-xs tracking-[0.3em] uppercase mb-4">The Numbers</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
              Proof of <span className="italic font-light text-muted-foreground dark:text-white/60">Excellence</span>
            </h2>
          </div>
          <p className="text-muted-foreground dark:text-white/50 text-base md:text-lg max-w-md leading-relaxed">
            Every number represents a story of success, trust, and unforgettable experiences.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-12 gap-4 md:gap-6">
          {/* Hero Stat - Large */}
          <div 
            className={`md:col-span-7 group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-white/10 border border-stone-200/50 dark:border-transparent p-10 md:p-14 lg:p-16 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "0.1s" }}
          >
            {/* Decorative gradient orb */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-stone-300/30 dark:bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <p className="text-muted-foreground dark:text-white/50 text-xs tracking-[0.3em] uppercase">Experience</p>
              </div>
              
              <div className="flex items-baseline gap-4 mb-6">
                <AboutAnimatedCounter 
                  target={37} 
                  isVisible={isVisible} 
                  delay={200}
                  className="text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter leading-none"
                />
                <span className="text-4xl md:text-5xl lg:text-6xl font-light text-muted-foreground/50 dark:text-white/30">years</span>
              </div>
              
              <p className="text-muted-foreground dark:text-white/60 text-lg md:text-xl leading-relaxed max-w-md">
                Of shaping Sri Lanka's entertainment landscape with passion and precision.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6">
            {/* Events Stat */}
            <div 
              className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-white/10 border border-stone-200/50 dark:border-transparent p-8 md:p-10 flex-1 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-stone-300/30 dark:bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <p className="text-muted-foreground dark:text-white/50 text-xs tracking-[0.3em] uppercase">Events Delivered</p>
                
                <div>
                  <h3 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
                    <AboutAnimatedCounter target={500} isVisible={isVisible} delay={300} className="" />
                    <span className="text-muted-foreground/50 dark:text-white/30">+</span>
                  </h3>
                  <p className="text-muted-foreground dark:text-white/50 text-sm mt-3">Seamless productions</p>
                </div>
              </div>
            </div>

            {/* Satisfaction Stat */}
            <div 
              className={`group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-white/10 border border-stone-200/50 dark:border-transparent p-8 md:p-10 flex-1 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-stone-300/30 dark:bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <p className="text-muted-foreground dark:text-white/50 text-xs tracking-[0.3em] uppercase">Client Satisfaction</p>
                
                <div>
                  <h3 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
                    <AboutAnimatedCounter target={98} isVisible={isVisible} delay={400} className="" />
                    <span className="text-muted-foreground/50 dark:text-white/30">%</span>
                  </h3>
                  <p className="text-muted-foreground dark:text-white/50 text-sm mt-3">Return & recommend</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Supporting Stats */}
          <div 
            className={`md:col-span-4 group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-white/10 border border-stone-200/50 dark:border-transparent p-8 md:p-10 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "0.4s" }}
          >
            <div>
              <p className="text-muted-foreground dark:text-white/50 text-xs tracking-[0.3em] uppercase mb-3">Team Size</p>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tighter">
                <AboutAnimatedCounter target={50} isVisible={isVisible} delay={500} className="" />
                <span className="text-muted-foreground/50 dark:text-white/30">+</span>
              </h3>
            </div>
          </div>

          <div 
            className={`md:col-span-4 group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-white/10 border border-stone-200/50 dark:border-transparent p-8 md:p-10 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "0.5s" }}
          >
            <div>
              <p className="text-muted-foreground dark:text-white/50 text-xs tracking-[0.3em] uppercase mb-3">Countries Served</p>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tighter">
                <AboutAnimatedCounter target={15} isVisible={isVisible} delay={600} className="" />
                <span className="text-muted-foreground/50 dark:text-white/30">+</span>
              </h3>
            </div>
          </div>

          <div 
            className={`md:col-span-4 group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-white/10 border border-stone-200/50 dark:border-transparent p-8 md:p-10 transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "0.6s" }}
          >
            <div>
              <p className="text-muted-foreground dark:text-white/50 text-xs tracking-[0.3em] uppercase mb-3">Industry Awards</p>
              <h3 className="text-5xl md:text-6xl font-bold tracking-tighter">
                <AboutAnimatedCounter target={25} isVisible={isVisible} delay={700} className="" />
                <span className="text-muted-foreground/50 dark:text-white/30">+</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Animated counter component for About page stats
function AboutAnimatedCounter({ target, isVisible, delay = 0, className }: { target: number; isVisible: boolean; delay?: number; className: string }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const frameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds for the count-up
    const startDelay = delay

    const timer = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const progress = timestamp - startTimeRef.current
        const percentage = Math.min(progress / duration, 1)
        
        // Custom easing - very slow at the end for dramatic effect
        // Using easeOutExpo for more pronounced deceleration
        const easeOutExpo = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage)
        
        countRef.current = Math.floor(easeOutExpo * target)
        setCount(countRef.current)

        if (percentage < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setCount(target)
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }, startDelay)

    return () => {
      clearTimeout(timer)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [isVisible, target, delay])

  return (
    <span className={`tabular-nums ${className}`}>
      {count}
    </span>
  )
}
