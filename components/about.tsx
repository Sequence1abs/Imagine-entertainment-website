"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

const services = ["Consultation", "Design", "Audio", "Video", "Lighting", "Staging", "Technical Direction"]
const industries = ["Corporate", "Television", "Film", "Theatre", "Fashion", "Brand Activation", "Awards"]

const stats = [
  { value: "500+", label: "Events Produced" },
  { value: "97%", label: "Client Satisfaction" },
  { value: "20+", label: "Years Experience" },
]

export default function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [countersVisible, setCountersVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountersVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    if (statsRef.current) statsObserver.observe(statsRef.current)

    return () => {
      observer.disconnect()
      statsObserver.disconnect()
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Statement */}
        <div className="mb-20">
          <div
            className={`mb-4 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-sm font-semibold tracking-widest text-foreground">BUILD MORE WITH</span>
          </div>
          <h2
            className={`text-6xl md:text-7xl lg:text-[120px] font-medium tracking-tight leading-none transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            IMAGINATION
          </h2>
        </div>

        {/* Expertise Section */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20 pt-8 border-t border-border">
          <div>
            <p
              className={`text-xs tracking-[0.2em] text-muted-foreground mb-6 transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              //Expertise
            </p>
            <h3
              className={`text-xl md:text-2xl font-medium mb-6 transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              A dedicated team—designers, technicians, and producers working side-by-side.
            </h3>
            <p
              className={`text-muted-foreground mb-6 leading-relaxed transition-all duration-700 delay-400 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              IMAGINE ENTERTAINMENT is a full-service event production company that takes ideas from conception to
              reality. Our cross-functional crew—production managers, technical directors, and creative
              designers—collaborates under one roof, so you deal with one accountable partner, not a patchwork of
              subcontractors.
            </p>
            <button
              className={`text-sm font-medium inline-flex items-center gap-2 group link-underline transition-all duration-700 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Let's work together
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Services & Industries Lists */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p
                className={`text-xs tracking-[0.2em] text-muted-foreground mb-6 transition-all duration-700 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                //Services
              </p>
              <ul className={`space-y-3 stagger-children ${isVisible ? "visible" : ""}`}>
                {services.map((service) => (
                  <li key={service} className="text-lg md:text-xl font-medium">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className={`text-xs tracking-[0.2em] text-muted-foreground mb-6 transition-all duration-700 delay-400 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                //Industries
              </p>
              <ul className={`space-y-3 stagger-children ${isVisible ? "visible" : ""}`}>
                {industries.map((industry) => (
                  <li key={industry} className="text-lg md:text-xl font-medium">
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div ref={statsRef} className="pt-8 border-t border-border">
          <p
            className={`text-xs tracking-[0.2em] text-muted-foreground mb-4 transition-all duration-700 ${
              countersVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            //Experience
          </p>
          <p
            className={`text-sm text-muted-foreground mb-8 transition-all duration-700 delay-100 ${
              countersVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            We're a diverse, tight-knit team of event production experts.
          </p>

          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`transition-all duration-700 ${
                  countersVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + index * 150}ms` }}
              >
                <span className="text-4xl md:text-5xl lg:text-6xl font-medium">{stat.value}</span>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
