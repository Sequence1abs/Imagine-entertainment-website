"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Footer from "@/components/footer"

const services = [
  {
    number: "01",
    title: "Corporate Events",
    description: "From intimate board meetings to large-scale conferences, we deliver seamless corporate experiences.",
    items: ["Events & Meetings", "Product Launches", "Brand Activation", "Automotive Events", "Fashion Shows"],
    image: "/corporate-event-stage-blue-lighting-conference.jpg",
  },
  {
    number: "02",
    title: "Television & Film",
    description: "Award-winning production support for broadcasts, live entertainment, and film projects.",
    items: ["Light Entertainment", "Factual Television", "Awards Shows", "Film Production", "Live Broadcasts"],
    image: "/brit-awards-stage-red-lighting-production.jpg",
  },
  {
    number: "03",
    title: "Theatre Production",
    description: "West End quality technical production for theatrical performances of all scales.",
    items: ["West End Theatre", "Touring Theatre", "Regional Theatre", "Dance Productions", "Opera"],
    image: "/theatre-stage-dramatic-spotlight-performance.jpg",
  },
]

export default function ServicesPage() {
  const [isLoaded, setIsLoaded] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-16">
            <div>
              <div className="overflow-hidden mb-3">
                <p
                  className={`text-muted-foreground text-xs tracking-[0.15em] transition-all duration-700 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                >
                  WHAT WE DO
                </p>
              </div>
              <h1>
                <div className="overflow-hidden">
                  <span
                    className={`block text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] transition-all duration-700 ${
                      isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
                    style={{ transitionDelay: "0.15s" }}
                  >
                    Creative Production <span className="italic font-normal text-muted-foreground">&</span> Development
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
              <p className="text-muted-foreground leading-relaxed max-w-md">
                The expertise and commitment we bring to your project makes us different. Your one-stop-place for event
                planning and production.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} />
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted mx-4 md:mx-6 rounded-2xl">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-12">
            <div>
              <p className="text-muted-foreground text-xs tracking-[0.15em] mb-3">//Technical Services</p>
              <h2 className="text-2xl md:text-3xl font-medium">Full Production Support</h2>
            </div>
            <div className="lg:self-end">
              <p className="text-muted-foreground leading-relaxed">
                Comprehensive technical services including consultation, design, audio, video, lighting, staging, and
                rentals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { title: "Audio Systems", desc: "State-of-the-art sound design" },
              { title: "Video Production", desc: "LED walls and live streaming" },
              { title: "Lighting Design", desc: "Creative lighting solutions" },
              { title: "Staging & Scenic", desc: "Custom staging and sets" },
            ].map((item, index) => (
              <TechCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-36 overflow-hidden mx-4 md:mx-6 mt-16 rounded-2xl">
        <div className="absolute inset-0 bg-foreground dark:bg-black">
          <img
            src="/dramatic-concert-stage-lighting-dark-atmospheric-p.jpg"
            alt="Production"
            className="w-full h-full object-cover opacity-30 dark:opacity-50"
          />
        </div>
        <div className="absolute inset-0 bg-black/40 dark:bg-black/70" />
        <div className="relative z-10 text-center text-white px-6">
          <p className="text-white/70 dark:text-white/80 text-xs tracking-[0.15em] mb-4">READY TO START?</p>
          <h2 className="text-3xl md:text-4xl font-medium mb-6 text-white dark:text-white">Let's create something extraordinary</h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-base font-medium border border-white/40 dark:border-white/50 px-6 py-3 rounded-full bg-transparent dark:bg-transparent text-white dark:text-foreground hover:bg-white hover:text-foreground dark:hover:bg-white dark:hover:text-black transition-all duration-400"
          >
            Talk to Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ServiceCard({ service, index }: { service: (typeof services)[0]; index: number }) {
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

  const serviceId = service.title.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")

  return (
    <div
      id={serviceId}
      ref={ref}
      className={`grid lg:grid-cols-2 gap-6 lg:gap-12 py-12 md:py-16 border-t border-border transition-all duration-700 scroll-mt-20 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="order-2 lg:order-1">
        <div className="flex items-start gap-4 md:gap-6 mb-6">
          <span className="text-4xl md:text-5xl font-medium text-muted-foreground/30">{service.number}</span>
          <div>
            <h3 className="text-xl md:text-2xl font-medium mb-3">{service.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
            <ul className="grid grid-cols-2 gap-1">
              {service.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium ml-12 md:ml-16">
          <span className="link-slide">Discuss your project</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative overflow-hidden aspect-[4/3] bg-muted rounded-xl group">
          <img
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            className="w-full h-full object-cover img-scale"
          />
        </div>
      </div>
    </div>
  )
}

function TechCard({ item, index }: { item: { title: string; desc: string }; index: number }) {
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
    <div
      ref={ref}
      className={`p-5 bg-background rounded-xl transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <h4 className="text-base font-medium mb-1">{item.title}</h4>
      <p className="text-sm text-muted-foreground">{item.desc}</p>
    </div>
  )
}
