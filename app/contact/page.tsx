"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowRight, ChevronDown, Check } from "lucide-react"
import Footer from "@/components/footer"

const projectTypes = [
  { value: "corporate", label: "Corporate Events" },
  { value: "television", label: "Television & Film" },
  { value: "theatre", label: "Theatre Production" },
  { value: "technical", label: "Technical Production" },
  { value: "fashion", label: "Fashion Shows" },
  { value: "music", label: "Music & Live Events" },
  { value: "other", label: "Other" },
]

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <div className="overflow-hidden mb-3">
              <p
                className={`text-muted-foreground text-xs tracking-[0.15em] transition-all duration-700 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                }`}
              >
                GET IN TOUCH
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
                  Let's Create Something
                  <br />
                  <span className="italic font-normal text-muted-foreground">Extraordinary</span>
                </span>
              </div>
            </h1>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20 md:pb-28">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <div
              className={`transition-all duration-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div
              className={`space-y-12 transition-all duration-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "0.5s" }}
            >
              <div>
                <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Email</p>
                <a
                  href="mailto:hello@imagineent.com"
                  className="text-2xl md:text-3xl font-medium hover:text-muted-foreground transition-colors"
                >
                  hello@imagineent.com
                </a>
              </div>

              <div>
                <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Phone</p>
                <a
                  href="tel:+442071234567"
                  className="text-2xl md:text-3xl font-medium hover:text-muted-foreground transition-colors"
                >
                  +44 20 7123 4567
                </a>
              </div>

              <div>
                <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Location</p>
                <p className="text-lg font-medium">London, United Kingdom</p>
                <p className="text-muted-foreground mt-1">Available worldwide</p>
              </div>

              <div>
                <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Follow Us</p>
                <div className="flex gap-8">
                  {["Instagram", "LinkedIn", "Twitter"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-base font-medium hover:text-muted-foreground transition-colors"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function ContactForm() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedLabel = projectTypes.find((t) => t.value === selectedType)?.label

  return (
    <form className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">NAME</label>
          <input
            type="text"
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">EMAIL</label>
          <input
            type="email"
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">COMPANY</label>
        <input
          type="text"
          className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
          placeholder="Company name"
        />
      </div>

      <div ref={dropdownRef} className="relative">
        <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">EVENT TYPE</label>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between bg-transparent border-b border-border pb-3 text-left transition-colors focus:border-foreground outline-none"
        >
          <span className={selectedType ? "text-foreground" : "text-muted-foreground/50"}>
            {selectedLabel || "Select event type"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
            <div className="py-2">
              {projectTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.value)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-muted transition-colors ${
                    selectedType === type.value ? "bg-muted" : ""
                  }`}
                >
                  <span>{type.label}</span>
                  {selectedType === type.value && <Check className="w-4 h-4 text-foreground" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">MESSAGE</label>
        <textarea
          rows={4}
          className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors resize-none text-base placeholder:text-muted-foreground/50"
          placeholder="Tell us about your project..."
        />
      </div>

      <button
        type="submit"
        className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full hover:bg-foreground/90 transition-colors text-sm font-medium mt-4"
      >
        Send Message
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </form>
  )
}
