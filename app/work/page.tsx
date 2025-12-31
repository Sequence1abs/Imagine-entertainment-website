"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import Footer from "@/components/footer"
import PublicLayout from "@/components/layouts/public-layout"
import { EVENT_CATEGORIES } from "@/lib/types/database"

// Project type
interface Project {
  id: string
  title: string
  category: string
  image: string
  event_date?: string
  location?: string
}

// Categories for filter (updated to match database)
const categories = [
  "All",
  ...EVENT_CATEGORIES,
]

// Fallback static projects (removed as per user request to avoid ghost data)
const fallbackProjects: Project[] = []

function WorkPageContent() {
  const [isLoaded, setIsLoaded] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Fetch events from API (falls back to static data if API fails)
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          if (data.events && data.events.length > 0) {
            setProjects(data.events.map((event: any) => ({
              id: event.id,
              title: event.title,
              category: event.category,
              image: event.cover_image_url || '/placeholder.svg',
              event_date: event.event_date,
              location: event.location,
            })))
          }
        }
      } catch {
        // Silently fall back to empty state
      }
    }
    fetchEvents()
  }, [])

  // Set active category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam)
    }
  }, [searchParams])

  const filteredProjects =
    activeCategory === "All" ? projects : projects.filter((p) => p.category === activeCategory)

  return (
    <PublicLayout>
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
                  OUR PORTFOLIO
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
                    Work & <span className="italic font-normal text-muted-foreground">Projects</span>
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
                Our creative playground featuring real projects and extraordinary productions across television,
                corporate events, and theatre.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-8" data-filter-section>
        <div className="max-w-[1400px] mx-auto">
          <div
            className={`flex flex-wrap gap-2 transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: "0.4s" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground border border-border hover:border-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted mx-4 md:mx-6 rounded-2xl text-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="text-muted-foreground text-xs tracking-[0.15em] mb-4">//Start a Project</p>
          <h2 className="text-2xl md:text-4xl font-medium mb-6">Have a project in mind?</h2>
          <Link
            href="/contact"
            className="cursor-target inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-lg md:text-xl font-medium hover:bg-foreground/90 transition-colors"
          >
            Let's Talk
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
    </PublicLayout>
  )
}

export default function WorkPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </main>
    }>
      <WorkPageContent />
    </Suspense>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      href={`/work/${project.id}`}
      ref={ref}
      className={`cursor-target group block transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${(index % 4) * 0.1}s` }}
    >
      <div className="relative overflow-hidden aspect-4/3 mb-4 bg-muted rounded-xl">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover img-scale"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-1">{project.category}</p>
        <h3 className="text-base font-medium group-hover:text-muted-foreground transition-colors">{project.title}</h3>
      </div>
    </Link>
  )
}
