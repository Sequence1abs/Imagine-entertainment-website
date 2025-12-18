"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ArrowDown } from "lucide-react"
import ClientsMarquee from "@/components/clients-marquee"
import Testimonials from "@/components/testimonials"
import Footer from "@/components/footer"

const featuredProjects = [
  {
    id: 1,
    title: "BRIT AWARDS 2024",
    category: "Television Production",
    image: "/brit-awards-stage-red-lighting-production.jpg",
  },
  {
    id: 2,
    title: "LONDON FASHION WEEK",
    category: "Fashion Shows",
    image: "/fashion-runway-show-pink-dramatic-lighting.jpg",
  },
  {
    id: 3,
    title: "CORPORATE SUMMIT",
    category: "Corporate Events",
    image: "/corporate-event-stage-blue-lighting-conference.jpg",
  },
  {
    id: 4,
    title: "WEST END PREMIERE",
    category: "Theatre",
    image: "/theatre-stage-dramatic-spotlight-performance.jpg",
  },
]

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden bg-foreground dark:bg-black"
        suppressHydrationWarning
      >
        {/* Background Image */}
        <div className="absolute inset-0" suppressHydrationWarning>
          <video
            className="w-full h-full min-h-[80vh] object-cover opacity-70 dark:opacity-70"
            src="/images/Imagine Entertainment Commercial 30 Sec.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/dramatic-stage-lighting-corporate-event-dark-green.jpg"
            aria-label="Imagine Entertainment showreel"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-foreground/60 via-foreground/50 to-foreground/30 dark:from-black/80 dark:via-black/60 dark:to-transparent"
            suppressHydrationWarning
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50" suppressHydrationWarning />
        </div>

        {/* Content */}
        {/* Hero content intentionally minimal (video focus) */}

        {/* Client logos at bottom */}
        <div
          className={`absolute bottom-8 left-0 right-0 transition-all duration-700 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: "0.9s" }}
          suppressHydrationWarning
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-10">
            <div className="flex items-center gap-8 md:gap-12 overflow-hidden">
              {["BBC", "Netflix", "Sky", "ITV", "Live Nation", "AEG"].map((client) => (
                <span key={client} className="text-xs tracking-wider text-white/60 dark:text-white/60 whitespace-nowrap">
                  {client}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center" suppressHydrationWarning>
          <a
            href="#philosophy"
            className="flex items-center gap-2 text-white/80 dark:text-white/80 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
            aria-label="Scroll down"
          >
            Scroll Down
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </a>
        </div>
      </section>

      {/* Philosophy section */}
      <section id="philosophy" className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <StatementReveal />
        </div>
      </section>

      <StatsSection />

      {/* Featured Projects */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3">//Featured Work</p>
              <h2 className="text-2xl md:text-3xl font-medium">Selected Projects</h2>
            </div>
            <Link
              href="/work"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Link href="/work" className="flex items-center gap-2 text-sm font-medium">
              View All Projects
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

            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {[
                { label: "Corporate", items: ["Events", "Launches", "Activations"] },
                { label: "Television", items: ["Entertainment", "Awards", "Factual"] },
                { label: "Theatre", items: ["West End", "Touring", "Regional"] },
                { label: "Technical", items: ["Audio", "Lighting", "Staging"] },
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

function ProjectCard({ project, index }: { project: (typeof featuredProjects)[0]; index: number }) {
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
      href={`/work/${project.id}`}
      ref={ref}
      className={`group relative block transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      {/* Hover preview "file" layer */}
      <div
        className="pointer-events-none absolute inset-2 rounded-xl shadow-lg opacity-0 scale-95 blur-sm transition-all duration-500 group-hover:opacity-80 group-hover:scale-100 group-hover:blur-0"
        style={{
          backgroundImage: `url(${project.image || "/placeholder.svg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
        aria-hidden
      />

      <div className="relative overflow-hidden aspect-[4/3] mb-4 bg-muted rounded-xl">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover img-scale relative z-10"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 z-10" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1">{project.category}</p>
        <h3 className="text-base font-medium group-hover:text-muted-foreground transition-colors">{project.title}</h3>
      </div>
    </Link>
  )
}
