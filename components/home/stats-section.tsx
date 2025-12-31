"use client"

import { useEffect, useState, useRef } from "react"

export function StatsSection() {
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
    { number: 37, suffix: "+", label: "Years of Excellence" },
    { number: 1000, suffix: "+", label: "Projects Delivered" },
    { number: 100, suffix: "+", label: "Creative Experts" },
    { number: 98, suffix: "%", label: "Client Satisfaction" },
  ]

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-0">
          <div className="lg:col-span-3">
            <p
              className={`text-muted-foreground text-xs tracking-[0.15em] transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              //BY THE NUMBERS
            </p>
          </div>
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
                  <div className="flex items-baseline">
                    <AnimatedCounter 
                      target={stat.number} 
                      isVisible={isVisible} 
                      delay={index * 100}
                    />
                    <span className="text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 italic">{stat.label}</p>
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

function AnimatedCounter({ target, isVisible, delay = 0 }: { target: number; isVisible: boolean; delay?: number }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const frameRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const startDelay = delay

    const timer = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const progress = timestamp - startTimeRef.current
        const percentage = Math.min(progress / duration, 1)
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
    <span className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight tabular-nums">
      {count}
    </span>
  )
}
