"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, ArrowDown } from "lucide-react"
import Hero from "@/components/hero"
import ClientsMarquee from "@/components/clients-marquee"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

const services = [
  {
    id: 1,
    title: "Corporate Events",
    eventType: "Corporate",
    filterCategory: "Corporate",
    image: "/corporate-event-stage-blue-lighting-conference.jpg",
    span: "lg:col-start-1 lg:col-span-1 lg:row-start-1 lg:row-span-2",
  },
  {
    id: 2,
    title: "Television & Film Production",
    eventType: "Television & Film",
    filterCategory: "Television & Film Production",
    image: "/brit-awards-stage-red-lighting-production.jpg",
    span: "lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:row-span-1",
  },
  {
    id: 3,
    title: "Musical Concert",
    eventType: "Musical Concert",
    filterCategory: "Music",
    image: "/music-festival-outdoor-stage-crowd-night-lights.jpg",
    span: "lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-1",
  },
  {
    id: 6,
    title: "Fixed Installation",
    eventType: "Fixed Installation",
    filterCategory: "Fixed Installation",
    image: "/professional-event-production-team-working-stage-s.jpg",
    span: "lg:col-start-1 lg:col-span-1 lg:row-start-3 lg:row-span-1",
  },
  {
    id: 7,
    title: "Weddings & Private Celebrations",
    eventType: "Weddings & Private Celebrations",
    filterCategory: "Weddings & Private Celebrations",
    image: "/dramatic-stage-lighting-corporate-event-dark-green.jpg",
    span: "sm:col-span-2 lg:col-start-2 lg:col-span-2 lg:row-start-3 lg:row-span-1",
  },
  {
    id: 4,
    title: "Rigging Services",
    eventType: "Rigging",
    filterCategory: "Rigging Services",
    image: "/professional-event-production-team-working-stage-s.jpg",
    span: "lg:col-start-4 lg:col-span-1 lg:row-start-1 lg:row-span-1",
  },
  {
    id: 5,
    title: "Public, Sports & Major Events",
    eventType: "Major Events",
    filterCategory: "Public, Sports & Major Events",
    image: "/dramatic-stage-lighting-corporate-event-dark-green.jpg",
    span: "sm:col-span-2 lg:col-start-2 lg:col-span-2 lg:row-start-2 lg:row-span-1",
  },
]

export default function Home() {

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Hero Section */}
      <Hero />

      {/* Philosophy section */}
      <section id="philosophy" className="pt-20 md:pt-28 pb-10 md:pb-14 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <StatementReveal />
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="pt-10 md:pt-14 pb-20 md:pb-28 mx-4 md:mx-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(300px,auto)]">
            {services.map((service, index) => (
              <ServiceBentoCard key={service.id} service={service} index={index} />
            ))}
            {/* View Our Services Card - Below Rigging Services */}
            <ViewServicesCard index={services.length} />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 bg-muted mx-4 md:mx-6 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Column - Expertise */}
            <div className="flex flex-col justify-center items-start">
              <p className="text-muted-foreground text-xs tracking-[0.15em] mb-4 font-medium uppercase">//Expertise</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                One Vision. One Team. One Flawless Event.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-lg text-base md:text-lg">
                At Imagine Entertainment, a single, seasoned team of producers, directors, and technicians brings your ideas to life from concept to execution. With our full-service, cross-functional crew working side by side under one roof, you get one accountable partner delivering seamless, unforgettable experiences.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-foreground to-foreground/90 text-background text-base font-semibold hover:from-foreground/90 hover:to-foreground transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Your Project Today
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Column - Services & Industries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
              {/*  Services */}
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.15em] mb-6 font-medium uppercase">//Services</p>
                <ul className="space-y-3">
                  {[
                    "Creative Direction",
                    "Technical Production",
                    "Event Management",
                    "Audio & Video",
                    "Lighting Design",
                    "Staging & Scenic",
                  ].map((item) => (
                    <li key={item} className="text-base text-foreground/80 font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industries */}
              <div>
                <p className="text-muted-foreground text-xs tracking-[0.15em] mb-6 font-medium uppercase">
                  //Industries
                </p>
                <ul className="space-y-3">
                  {[
                    "Corporate",
                    "Television & Film",
                    "Theatre",
                    "Fashion",
                    "Music & Live",
                    "Automotive",
                  ].map((item) => (
                    <li key={item} className="text-base text-foreground/80 font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients & Testimonials */}
      <ClientsMarquee />
      <Testimonials />

      <StatsSection />

      {/* Pre-footer CTA */}
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden mx-4 md:mx-6 rounded-2xl">
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
            <p className="text-sm tracking-[0.2em] mb-4 text-white/70 dark:text-white/80">READY TO CREATE?</p>
            <Link href="/contact" className="group inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all rounded-full">
              <span className="text-xl md:text-2xl font-medium text-white dark:text-white">Let's Talk</span>
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function StatsSection() {
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

  const stats = [
    { number: "37", suffix: "+", label: "Years of Excellence" },
    { number: "1000", suffix: "+", label: "Projects Delivered" },
    { number: "100", suffix: "+", label: "Creative Experts" },
    { number: "98", suffix: "%", label: "Client Satisfaction" },
  ]

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-0">
          {/* Left side - label */}
          <div className="lg:col-span-3">
            <p
              className={`text-muted-foreground text-xs tracking-[0.15em] transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              //By The Numbers
            </p>
          </div>

          {/* Right side - stats grid */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`relative transition-all duration-700 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  {/* Large number */}
                  <div className="flex items-baseline">
                    <span className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight">{stat.number}</span>
                    <span className="text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground">
                      {stat.suffix}
                    </span>
                  </div>
                  {/* Label */}
                  <p className="text-sm text-muted-foreground mt-2 italic">{stat.label}</p>
                  {/* Decorative line */}
                  <div
                    className={`absolute -top-4 left-0 w-8 h-px bg-border transition-all duration-700 ${
                      isVisible ? "scale-x-100" : "scale-x-0"
                    }`}
                    style={{ transitionDelay: `${index * 0.1 + 0.2}s`, transformOrigin: "left" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatementReveal() {
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
        Every great experience starts with a story. We partner with you to shape that story—from imagination to impact—creating moments people remember.
      </p>
    </div>
  )
}

function ServiceBentoCard({ service, index }: { service: (typeof services)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

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
    <Link
      href={`/work?category=${encodeURIComponent(service.filterCategory || service.eventType)}`}
      ref={ref}
      className={`group relative block h-full min-h-[300px] md:min-h-[350px] overflow-hidden rounded-xl transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${service.span} w-full`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-500" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="relative z-10">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-white dark:text-white leading-tight">
            {service.title}
          </h3>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-all duration-500 pointer-events-none" />
    </Link>
  )
}

function ViewServicesCard({ index }: { index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

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
    <Link
      href="/services"
      ref={ref}
      className={`group relative block h-full min-h-[300px] md:min-h-[350px] overflow-hidden rounded-xl transition-all duration-700 lg:col-start-4 lg:row-start-2 lg:col-span-1 lg:row-span-1 w-full ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted dark:bg-muted/50 group-hover:bg-muted/80 dark:group-hover:bg-muted/70 transition-all duration-500" />
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-foreground mb-4 leading-tight">
            View Our Services
          </h3>
          <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 mx-auto text-muted-foreground dark:text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-border dark:group-hover:border-border rounded-xl transition-all duration-500 pointer-events-none" />
    </Link>
  )
}
