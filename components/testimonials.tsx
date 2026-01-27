"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"

const testimonials = [
  {
    quote:
      "I wish to extend my sincere appreciation and heartfelt gratitude to each of you at imagine entertainment for the outstanding professionalism, dedication, flexibility, and unwavering positivity demonstrated throughout the planning and execution of the 2025 Litro Gas Channel Award Ceremony. This year's event was a remarkable success, and it is clear that such excellence was achieved through your collective effort, creativity, and commitment to delivering nothing short of the best.",
    author: "Mr. Janaka Pathirathna",
    role: "Director Sales & Marketing/ Corporate Affairs",
    company: "Litro Gas Lanka Ltd.",
    highlights: ["outstanding professionalism", "remarkable success", "nothing short of the best"],
  },
  {
    quote:
      "A huge thank you to Imagine Entertainment for all their support and expertise this year. From start to finish, their team was incredibly professional, accommodating, and went above and beyond to make our event a success. The production truly elevated entertainment standards in Sri Lanka, and we look forward to working with Imagine Entertainment for many more events in the future.",
    author: "Mr. Akash Rathnasingham",
    role: "Director",
    company: "serendisco Team",
    highlights: ["incredibly professional", "above and beyond", "elevated entertainment standards"],
  },
  {
    quote:
      "Thank you for the excellent job done in organizing our annual award ceremony. Your hard work, creativity, and attention to detail made the event truly memorable. From planning to execution, every element reflected your dedication and teamwork. We sincerely appreciate the effort each of you put in to ensure everything ran smoothly and successfully. Thank you once again for your outstanding contribution and commitment make Siyapatha night a special night",
    author: "Mr. Prasad Udugampola",
    role: "Chief Human Resources Officer",
    company: "Siyapatha Finance PLC",
    highlights: ["excellent job", "truly memorable", "outstanding contribution"],
  },
]

// Function to render quote with highlights
function renderQuoteWithHighlights(quote: string, highlights: string[]) {
  if (!highlights || highlights.length === 0) return `"${quote}"`
  
  let result = quote
  const parts: (string | { text: string; isHighlight: boolean })[] = []
  
  // Sort highlights by their position in the quote (to process in order)
  const sortedHighlights = highlights
    .map(h => ({ text: h, index: quote.toLowerCase().indexOf(h.toLowerCase()) }))
    .filter(h => h.index !== -1)
    .sort((a, b) => a.index - b.index)
  
  let lastIndex = 0
  sortedHighlights.forEach(({ text, index }) => {
    // Find the actual case-sensitive text in the quote
    const actualIndex = quote.toLowerCase().indexOf(text.toLowerCase(), lastIndex)
    if (actualIndex !== -1) {
      // Add text before highlight
      if (actualIndex > lastIndex) {
        parts.push(quote.slice(lastIndex, actualIndex))
      }
      // Add highlighted text (preserve original case)
      parts.push({ text: quote.slice(actualIndex, actualIndex + text.length), isHighlight: true })
      lastIndex = actualIndex + text.length
    }
  })
  // Add remaining text
  if (lastIndex < quote.length) {
    parts.push(quote.slice(lastIndex))
  }
  
  return (
    <>
      &quot;
      {parts.map((part, i) => 
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <span 
            key={i} 
            style={{ color: 'var(--brand-orange)' }}
          >
            {part.text}
          </span>
        )
      )}
      &quot;
    </>
  )
}

// Same as original CSS: transition-all duration-500, translate-y-4 -> translate-y-0
const quoteVariants = {
  initial: { 
    opacity: 0, 
    y: 16, // Same as CSS translate-y-4 (16px)
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5, // Same as CSS duration-500
    },
  },
  exit: { 
    opacity: 0, 
    y: -16,
    transition: {
      duration: 0.3,
    },
  },
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Auto-rotate testimonials
  useEffect(() => {
    if (isInView && !isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
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
  }, [isInView, isPaused])

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000)
  }

  const currentTestimonial = testimonials[activeIndex]

  // Dynamic text size based on quote length
  const getQuoteTextSize = (quoteLength: number) => {
    if (quoteLength < 150) return "text-xl md:text-2xl lg:text-3xl"
    if (quoteLength < 250) return "text-lg md:text-xl lg:text-2xl"
    if (quoteLength < 400) return "text-base md:text-lg lg:text-xl"
    return "text-sm md:text-base lg:text-lg"
  }

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 bg-muted/30 mx-4 md:mx-6 rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left column - title and nav */}
          <div className="lg:col-span-4">
            {/* Same as CSS: transition-all duration-700, translate-y-6 -> translate-y-0 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-muted-foreground text-xs tracking-[0.2em] mb-4"><span style={{ color: "var(--brand-orange)" }}>{'//'}</span>TESTIMONIALS</p>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8">
                What Our
                <br />
                <span className="italic font-normal text-muted-foreground">Clients Say</span>
              </h2>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevTestimonial}
                  className="cursor-target w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="cursor-target w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted-foreground ml-3 font-mono">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right column - testimonial content with AnimatePresence */}
          <div className="lg:col-span-8 relative">
            {/* Large quote watermark - right upper corner */}
            <svg 
              className="absolute -top-16 -right-16 md:-right-24 w-64 h-64 md:w-md md:h-112 lg:w-xl lg:h-144 text-foreground/6 dark:text-white/6"
              viewBox="0 0 100 100" 
              fill="currentColor"
            >
              <path d="M30 70 Q20 70 20 55 Q20 40 35 30 L40 38 Q30 45 30 55 Q30 60 40 60 Q45 60 45 65 Q45 70 40 70 Z M60 70 Q50 70 50 55 Q50 40 65 30 L70 38 Q60 45 60 55 Q60 60 70 60 Q75 60 75 65 Q75 70 70 70 Z" />
            </svg>
            
            {/* Same as CSS: transition-all duration-700 delay-150ms */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative min-h-[280px] z-10"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={quoteVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <blockquote className={`${getQuoteTextSize(currentTestimonial.quote.length)} font-medium leading-relaxed mb-6 text-foreground`}>
                    {renderQuoteWithHighlights(currentTestimonial.quote, currentTestimonial.highlights)}
                  </blockquote>

                  <div className="flex items-center gap-4 pt-6 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium">
                        {currentTestimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-base mb-0.5">{currentTestimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentTestimonial.role}, {currentTestimonial.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
