"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Footer from "@/components/footer"

const allProjects = [
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
    title: "CORPORATE SUMMIT 2024",
    category: "Corporate Events",
    image: "/corporate-event-stage-blue-lighting-conference.jpg",
  },
  {
    id: 4,
    title: "WEST END PREMIERE",
    category: "Theatre",
    image: "/theatre-stage-dramatic-spotlight-performance.jpg",
  },
  {
    id: 5,
    title: "PRODUCT LAUNCH",
    category: "Brand Activation",
    image: "/product-launch-event-modern-minimal-tech-stage.jpg",
  },
  {
    id: 6,
    title: "FILM PREMIERE",
    category: "Film Events",
    image: "/film-premiere-red-carpet-night-event-glamour-lond.jpg",
  },
]

const categories = [
  "All",
  "Television Production",
  "Corporate Events",
  "Theatre",
  "Fashion Shows",
  "Brand Activation",
  "Film Events",
]

export default function WorkPage() {
  const [isLoaded, setIsLoaded] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const filteredProjects =
    activeCategory === "All" ? allProjects : allProjects.filter((p) => p.category === activeCategory)

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

      <section className="px-6 md:px-10 pb-8">
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
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-muted mx-4 md:mx-6 rounded-2xl text-center">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <p className="text-muted-foreground text-xs tracking-[0.15em] mb-4">//Start a Project</p>
          <h2 className="text-2xl md:text-4xl font-medium mb-6">Have a project in mind?</h2>
          <Link href="/contact" className="inline-flex items-center gap-2 text-base font-medium">
            <span className="link-slide">Let's Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ProjectCard({ project, index }: { project: (typeof allProjects)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
      className={`group block transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${(index % 2) * 0.1}s` }}
    >
      <div className="relative overflow-hidden aspect-[4/3] mb-4 bg-muted rounded-xl">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover img-scale"
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
