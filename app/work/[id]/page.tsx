"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import Footer from "@/components/footer"

// Project details data
const projectDetails: Record<
  number,
  {
    id: number
    title: string
    category: string
    description: string
    client: string
    year: string
    location: string
    services: string[]
    images: string[]
    overview: string
    challenge: string
    solution: string
  }
> = {
  1: {
    id: 1,
    title: "BRIT AWARDS 2024",
    category: "Television Production",
    description: "Award-winning production for the UK's most prestigious music awards ceremony.",
    client: "BRIT Awards",
    year: "2024",
    location: "London, UK",
    services: ["Live Broadcast", "Lighting Design", "Audio Production", "Stage Management"],
    images: [
      "/brit-awards-stage-red-lighting-production.jpg",
      "/awards-show-stage-production.jpg",
      "/awards-show-stage-red-carpet-dramatic-lighting.jpg",
      "/brit-awards-stage-dramatic-lighting-production.jpg",
      "/theatre-stage-lights-performance.jpg",
      "/behind-the-scenes-event-production-crew-working-ba.jpg",
    ],
    overview:
      "We delivered a spectacular production for the BRIT Awards 2024, featuring cutting-edge lighting design, flawless audio engineering, and seamless stage management. The event was broadcast live to millions of viewers worldwide.",
    challenge:
      "Coordinating multiple live performances, managing complex lighting cues, and ensuring broadcast-quality audio across a large venue while maintaining the energy and excitement of a live awards show.",
    solution:
      "Our team implemented a comprehensive production plan with redundant systems, real-time monitoring, and a dedicated broadcast team working in sync with the live event crew to deliver a flawless experience.",
  },
  2: {
    id: 2,
    title: "LONDON FASHION WEEK",
    category: "Fashion Shows",
    description: "High-energy fashion show production with dramatic lighting and seamless runway management.",
    client: "British Fashion Council",
    year: "2024",
    location: "London, UK",
    services: ["Runway Production", "Lighting Design", "Event Management", "Technical Direction"],
    images: [
      "/fashion-runway-show-pink-dramatic-lighting.jpg",
      "/fashion-runway-show-pink-dramatic-lighting-models.jpg",
      "/fashion-runway-show-dramatic-lighting-models-catwa.jpg",
      "/fashion-runway-show-professional-lighting-pink.jpg",
      "/fashion-show-runway-lighting.jpg",
      "/corporate-event-stage-lighting.jpg",
    ],
    overview:
      "We transformed a historic London venue into a cutting-edge fashion showcase, creating an immersive experience that highlighted the collections while maintaining the elegance and sophistication expected at London Fashion Week.",
    challenge:
      "Creating a visually stunning environment that complements diverse fashion collections while managing tight schedules, multiple designer shows, and international media coverage.",
    solution:
      "We developed a flexible lighting and staging system that could be quickly reconfigured between shows, with dedicated teams for each designer ensuring their vision was perfectly executed.",
  },
  3: {
    id: 3,
    title: "CORPORATE SUMMIT 2024",
    category: "Corporate Events",
    description: "Large-scale corporate conference with multiple stages, breakout sessions, and networking areas.",
    client: "Global Tech Corporation",
    year: "2024",
    location: "London, UK",
    services: ["Conference Production", "AV Systems", "Stage Design", "Event Technology"],
    images: [
      "/corporate-event-stage-blue-lighting-conference.jpg",
      "/corporate-event-stage-professional-lighting-confer.jpg",
      "/corporate-event-stage-professional-lighting-dark.jpg",
      "/corporate-event-stage-with-dramatic-lighting.jpg",
      "/tech-product-launch-event-modern-minimal.jpg",
      "/professional-event-production-team-working-stage-s.jpg",
    ],
    overview:
      "We produced a comprehensive corporate summit bringing together 2,000+ executives, featuring main stage presentations, interactive breakout sessions, and sophisticated networking environments.",
    challenge:
      "Managing multiple concurrent sessions, ensuring seamless technology integration, and creating an engaging experience that facilitated meaningful business connections.",
    solution:
      "Our integrated approach combined state-of-the-art AV systems, intuitive wayfinding, and carefully designed spaces that encouraged interaction while maintaining professional standards throughout the event.",
  },
  4: {
    id: 4,
    title: "WEST END PREMIERE",
    category: "Theatre",
    description: "Technical production for a major West End theatrical premiere with complex staging requirements.",
    client: "West End Theatre",
    year: "2024",
    location: "London, UK",
    services: ["Theatrical Production", "Scenic Design", "Lighting & Sound", "Stage Automation"],
    images: [
      "/theatre-stage-dramatic-spotlight-performance.jpg",
      "/theatre-stage-dramatic-spotlight-performance-curta.jpg",
      "/theatre-stage-dramatic-lighting-blue.jpg",
      "/theatre-stage-lights-performance.jpg",
      "/theatre-stage-performance.jpg",
      "/awards-show-stage-production.jpg",
    ],
    overview:
      "We provided complete technical production services for a major West End premiere, including custom scenic elements, sophisticated lighting design, and precision stage automation that brought the director's vision to life.",
    challenge:
      "Creating seamless scene transitions, managing complex automation sequences, and ensuring every performance element worked in perfect harmony to support the narrative.",
    solution:
      "Our theatrical production team worked closely with the creative team to develop custom solutions, including programmable automation, dynamic lighting systems, and integrated audio that enhanced the storytelling.",
  },
  5: {
    id: 5,
    title: "PRODUCT LAUNCH",
    category: "Brand Activation",
    description: "Innovative product launch event combining technology, entertainment, and brand storytelling.",
    client: "Tech Innovation Brand",
    year: "2024",
    location: "London, UK",
    services: ["Brand Activation", "Event Production", "Content Creation", "Digital Integration"],
    images: [
      "/tech-product-launch-event-modern-minimal.jpg",
      "/product-launch-event-modern-minimal-tech-stage.jpg",
      "/product-launch-event-modern-minimal-tech.jpg",
      "/product-launch-event-venue.jpg",
      "/corporate-event-stage-lighting.jpg",
      "/professional-event-production-team-working-stage-s.jpg",
    ],
    overview:
      "We created an immersive product launch experience that seamlessly blended live presentations, interactive demonstrations, and digital elements to showcase a revolutionary new product to media and key stakeholders.",
    challenge:
      "Balancing technical demonstrations with engaging entertainment, ensuring media coverage captured the product's innovation, and creating shareable moments for social media.",
    solution:
      "We designed a multi-zone experience with dedicated areas for presentations, hands-on demos, and networking, supported by integrated social media walls and live streaming capabilities.",
  },
  6: {
    id: 6,
    title: "FILM PREMIERE",
    category: "Film Events",
    description: "Red carpet premiere event with celebrity arrivals, press interviews, and exclusive screening.",
    client: "Film Studio",
    year: "2024",
    location: "London, UK",
    services: ["Premiere Production", "Red Carpet Management", "Media Coordination", "Screening Production"],
    images: [
      "/film-premiere-red-carpet-night-event-glamour-lond.jpg",
      "/film-premiere-red-carpet-night-event-glamour.jpg",
      "/film-premiere-red-carpet-night-event.jpg",
      "/film-premiere-red-carpet-event.jpg",
      "/film-premiere-event.jpg",
      "/awards-show-stage-production.jpg",
    ],
    overview:
      "We orchestrated a glamorous film premiere including red carpet arrivals, press interviews, VIP reception, and a private screening, ensuring every detail reflected the prestige of the production.",
    challenge:
      "Managing celebrity arrivals, coordinating with multiple media outlets, creating photo opportunities, and ensuring a seamless flow from red carpet to screening while maintaining security and exclusivity.",
    solution:
      "Our experienced team managed all aspects of the premiere, from red carpet logistics and media coordination to screening room setup, ensuring a flawless experience for talent, guests, and press.",
  },
}

export default function WorkDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const projectId = Number(params.id)
  const project = projectDetails[projectId]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === "Escape") {
        setLightboxOpen(false)
      } else if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, currentImageIndex, project])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ""
  }

  const handleNext = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const handlePrevious = () => {
    if (project) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
    }
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">Project Not Found</h1>
          <Link href="/work" className="text-muted-foreground hover:text-foreground">
            Back to Work
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background" suppressHydrationWarning>
      {/* Hero Image */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/70 to-foreground/40 dark:from-black/90 dark:via-black/70 dark:to-black/40" />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />
        
        <div className="absolute bottom-0 left-0 right-0 z-10 max-w-[1400px] mx-auto px-6 md:px-10 pb-8 md:pb-12">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-white dark:text-white mb-6 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Work</span>
          </Link>
          
          <div
            className={`transition-all duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-white/80 dark:text-white/80 text-xs tracking-[0.15em] mb-3">
              {project.category}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white dark:text-white mb-4">
              {project.title}
            </h1>
            <p className="text-white/90 dark:text-white/90 text-base md:text-lg max-w-2xl">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-12 md:py-16 px-6 md:px-10 border-b border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <p className="text-xs text-muted-foreground mb-2">CLIENT</p>
              <p className="text-sm font-medium">{project.client}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">YEAR</p>
              <p className="text-sm font-medium">{project.year}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">LOCATION</p>
              <p className="text-sm font-medium">{project.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">SERVICES</p>
              <div className="flex flex-wrap gap-2">
                {project.services.map((service) => (
                  <span key={service} className="text-xs text-muted-foreground">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Images Gallery */}
      <section className="py-12 md:py-20 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {project.images.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl aspect-[4/3] bg-muted cursor-pointer group transition-all duration-700 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && project && (
        <div
          className="fixed inset-0 z-50 bg-black/95 p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 text-white hover:text-white/80 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-4 z-10 text-white hover:text-white/80 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-4 z-10 text-white hover:text-white/80 transition-colors bg-black/50 hover:bg-black/70 rounded-full p-3"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div
            className="w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {currentImageIndex + 1} / {project.images.length}
          </div>
        </div>
      )}

      {/* Project Details */}
      <section className="py-12 md:py-20 px-6 md:px-10 bg-muted">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-1">
              <p className="text-xs text-muted-foreground tracking-[0.15em] mb-3">//Overview</p>
              <h2 className="text-2xl md:text-3xl font-medium mb-6">Project Overview</h2>
            </div>
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h3 className="text-lg font-medium mb-4">The Challenge</h3>
                <p className="text-muted-foreground leading-relaxed">{project.challenge}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Our Solution</h3>
                <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">About the Project</h3>
                <p className="text-muted-foreground leading-relaxed">{project.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project CTA */}
      <section className="py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto text-center">
          <p className="text-muted-foreground text-xs tracking-[0.15em] mb-4">//Explore More</p>
          <h2 className="text-2xl md:text-4xl font-medium mb-8">View More Projects</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-medium border border-border px-6 py-3 rounded-full hover:bg-foreground hover:text-background transition-all duration-300"
            >
              All Projects
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

