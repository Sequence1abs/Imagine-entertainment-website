"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
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
    image: "/corporate-event-stage-blue-lighting-conference.jpg",
    span: "lg:col-span-1 lg:row-span-2",
  },
  {
    id: 2,
    title: "Television & Film Production",
    eventType: "Television & Film",
    image: "/brit-awards-stage-red-lighting-production.jpg",
    span: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: 3,
    title: "Music",
    eventType: "Music",
    image: "/music-festival-outdoor-stage-crowd-night-lights.jpg",
    span: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: 4,
    title: "Rigging Services",
    eventType: "Rigging",
    image: "/professional-event-production-team-working-stage-s.jpg",
    span: "lg:col-span-1 lg:row-span-2",
  },
  {
    id: 5,
    title: "Public, Sports & Major Events",
    eventType: "Major Events",
    image: "/dramatic-stage-lighting-corporate-event-dark-green.jpg",
    span: "sm:col-span-2 lg:col-span-2 lg:row-span-1",
  },
  {
    id: 6,
    title: "Theatre Production",
    eventType: "Theatre",
    image: "/theatre-stage-dramatic-spotlight-performance.jpg",
    span: "lg:col-span-1 lg:row-span-1",
  },
]

export default function Home() {

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Hero Section */}
      <Hero />

      {/* Philosophy section */}
      <section id="philosophy" className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <StatementReveal />
        </div>
      </section>

      <StatsSection />

      {/* Services Bento Grid */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3">//What We Do</p>
              <h2 className="text-2xl md:text-3xl font-medium">Our Services</h2>
            </div>
            <Link
              href="/services"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View All Services
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(300px,auto)]">
            {services.map((service, index) => (
              <ServiceBentoCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Link href="/services" className="flex items-center gap-2 text-sm font-medium">
              View All Services
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-28 bg-muted mx-4 md:mx-6 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3">//What We Do</p>
              <h2 className="text-2xl md:text-4xl font-medium leading-tight mb-6">
                Creative Production <span className="italic font-normal text-muted-foreground">&</span>
                <br />
                Event Excellence
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                We bring together creativity, technology, and precision to deliver unforgettable experiences.
              </p>
              <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium">
                Our Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { label: "Corporate", items: ["Galas & Awards", "Product Launches", "Conferences"] },
                { label: "Television & Film", items: ["Feature Films", "Reality TV", "Documentaries"] },
                { label: "Music", items: ["Concerts & Tours", "Festivals", "Classical"] },
                { label: "Rigging Services", items: ["Stage Rigging", "Automation", "Special Effects"] },
                { label: "Major Events", items: ["Sports Events", "Public Events", "Ceremonies"] },
                { label: "Theatre", items: ["West End", "Touring", "Regional"] },
              ].map((service) => (
                <div key={service.label}>
                  <h3 className="text-base font-medium mb-2">{service.label}</h3>
                  <ul className="space-y-1">
                    {service.items.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
        <img
          src="/behind-the-scenes-event-production-crew-working-ba.jpg"
          alt="Behind the scenes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white dark:text-white px-6">
            <p className="text-sm tracking-[0.2em] mb-4 text-white/70 dark:text-white/80">READY TO CREATE?</p>
            <Link href="/contact" className="group inline-flex items-center gap-3 text-3xl md:text-5xl font-medium text-white dark:text-white">
              <span className="link-slide">Let's Talk</span>
              <ArrowUpRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
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
    { number: "15", suffix: "+", label: "Years of Excellence" },
    { number: "500", suffix: "+", label: "Projects Delivered" },
    { number: "50", suffix: "+", label: "Creative Experts" },
    { number: "98", suffix: "%", label: "Client Satisfaction" },
  ]

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-10 border-y border-border">
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

      <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium leading-tight">
        <span
          className={`block transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          We're not just a production company.
        </span>
        <span
          className={`block italic font-normal text-muted-foreground transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "0.15s" }}
        >
          We're your creative partner.
        </span>
      </h2>

      <p
        className={`mt-6 text-muted-foreground max-w-xl mx-auto leading-relaxed transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "0.3s" }}
      >
        From concept to execution, we deliver experiences that leave lasting impressions.
      </p>
    </div>
  )
}

function ServiceBentoCard({ service, index }: { service: (typeof services)[0]; index: number }) {
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
    <Link
      href={`/services#${service.title.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and").replace(/,/g, "").replace(/\s*,\s*/g, "-")}`}
      ref={ref}
      className={`group relative block h-full min-h-[300px] md:min-h-[350px] overflow-hidden rounded-xl transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${service.span} w-full`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={service.image || "/placeholder.svg"}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-500" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
        <div className="relative z-10">
          <p className="text-xs md:text-sm text-white/80 dark:text-white/80 tracking-[0.15em] uppercase mb-2">
            {service.eventType}
          </p>
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
