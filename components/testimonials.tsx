"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

const testimonials = [
  {
    quote:
      "IMAGINE delivered beyond our expectations. Their attention to detail transformed our product launch into an unforgettable experience.",
    author: "Sarah Mitchell",
    role: "Marketing Director",
    company: "Mercedes-Benz UK",
  },
  {
    quote:
      "Working with IMAGINE on the BRIT Awards was seamless. Their technical expertise and ability to handle pressure made them invaluable.",
    author: "James Crawford",
    role: "Executive Producer",
    company: "BBC Studios",
  },
  {
    quote:
      "The team's creativity and professionalism are unmatched. They turned our vision into reality with precision and style.",
    author: "Emma Thompson",
    role: "Events Director",
    company: "Live Nation UK",
  },
]

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

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

  // Auto-rotate testimonials
  useEffect(() => {
    if (isVisible && !isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000) // Change testimonial every 5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible, isPaused])

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
    // Pause auto-rotation temporarily when user interacts
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    // Pause auto-rotation temporarily when user interacts
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
  }

  return (
    <section
      ref={ref}
      className="py-24 lg:py-32 px-6 lg:px-12 bg-muted/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left column - title and nav */}
          <div className="lg:col-span-4">
            <div
              className={`transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <p className="text-muted-foreground text-xs tracking-[0.2em] mb-4">//Testimonials</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8">
                What Our
                <br />
                <span className="italic font-normal text-muted-foreground">Clients Say</span>
              </h2>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted-foreground ml-3 font-mono">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Right column - testimonial content */}
          <div className="lg:col-span-8">
            <div
              className={`relative transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "0.15s" }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === activeIndex
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed mb-8 text-foreground">
                    {testimonial.quote}
                  </blockquote>

                  <div className="flex items-center gap-4 pt-6 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium">
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-base mb-0.5">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
