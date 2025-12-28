"use client"

import { useEffect, useState, useRef } from "react"
import type React from "react"
import { ArrowRight, ChevronDown, Check } from "lucide-react"
import Footer from "@/components/footer"

const projectTypes = [
  { value: "corporate", label: "Corporate" },
  { value: "television", label: "Television & Film Production" },
  { value: "concert", label: "Musical Concert" },
  { value: "rigging", label: "Rigging Services" },
  { value: "public-sports", label: "Public, Sports & Major Events" },
  { value: "fixed-installation", label: "Fixed Installation" },
  { value: "weddings", label: "Weddings & Private Celebrations" },
  { value: "other", label: "Other" },
]

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] bg-foreground dark:bg-black text-white overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <img
            src="/behind-the-scenes-event-production-crew-working-ba.jpg"
            alt="Let's talk"
            className="w-full h-full object-cover opacity-40 dark:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-foreground/40 dark:from-black/90 dark:via-black/70 dark:to-black/50" />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <div className="mb-3">
              <p className="text-white/50 dark:text-white/70 text-xs tracking-[0.15em]">
                GET IN TOUCH
              </p>
            </div>
            <h1>
              <span className="block text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-white dark:text-white">
                Let's Create Something
                <br />
                <span className="italic font-normal text-white/80 dark:text-white/70">Extraordinary</span>
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="pt-16 md:pt-24 px-6 md:px-10 pb-10 md:pb-14">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
            {/* Contact Info - Left Side */}
            <div className="flex flex-col justify-between h-full">
              {/* Contact Details */}
              <div className="space-y-12">
                <div
                  className={`transition-all duration-700 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: "0.3s" }}
                >
                  <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Email</p>
                  <a
                    href="mailto:info@imaginesl.com"
                    className="text-2xl md:text-3xl font-medium hover:text-muted-foreground transition-colors"
                  >
                    info@imaginesl.com
                  </a>
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: "0.4s" }}
                >
                  <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Phone</p>
                  <a
                    href="tel:+94717750744"
                    className="text-2xl md:text-3xl font-medium hover:text-muted-foreground transition-colors"
                  >
                    +94 717 750744
                  </a>
                </div>

                <div
                  className={`transition-all duration-700 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: "0.5s" }}
                >
                  <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Location</p>
                  <address className="text-lg font-medium not-italic leading-relaxed">
                    <p>No : 97 Delkanda,</p>
                    <p>Old Kesbewa Road,</p>
                    <p>Nugegoda 10250,</p>
                    <p>Sri Lanka.</p>
                  </address>
                </div>
              </div>

              {/* Social Icons - Pushed to Bottom */}
              <div 
                className={`mt-12 lg:mt-0 transition-all duration-700 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: "0.6s" }}
              >
                <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Follow Us</p>
                <div className="flex gap-3">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com/imaginesl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  {/* Instagram */}
                  <a
                    href="https://instagram.com/imagine_sl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  {/* TikTok */}
                  <a
                    href="https://tiktok.com/@imaginesl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300"
                    aria-label="TikTok"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                    </svg>
                  </a>
                  {/* YouTube */}
                  <a
                    href="https://youtube.com/@imaginesl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Form - Right Side (Highlighted) */}
            <div
              className={`transition-all duration-700 ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: "0.4s" }}
            >
              {/* Highlighted Form Container */}
              <div className="relative overflow-hidden bg-stone-100 dark:bg-white/5 rounded-3xl p-8 md:p-10 border border-stone-200/80 dark:border-white/10 shadow-lg dark:shadow-none">
                {/* Subtle glare/shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5 dark:via-transparent pointer-events-none" />
                <div className="relative z-10">
                  {/* Form Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-medium mb-3">Got ideas? Let's bring them to life.</h2>
                    <p className="text-muted-foreground text-sm md:text-base">Tell us about your project and we'll get back to you within 24 hours.</p>
                  </div>
                  
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <MapSection />

      <Footer />
    </main>
  )
}

function ContactForm() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          eventType: selectedLabel || null,
          message: formData.message,
        }),
      })

      let data: any = {}
      try {
        const text = await response.text()
        if (text) {
          data = JSON.parse(text)
        }
      } catch (e) {
        // If response is not JSON, use empty object
        console.warn("Response is not valid JSON:", e)
      }

      if (response.ok) {
        setSubmitStatus("success")
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        })
        setSelectedType(null)
        // Reset status after 5 seconds
        setTimeout(() => {
          setSubmitStatus("idle")
          setErrorMessage("")
        }, 5000)
      } else {
        const errorMsg = data?.error || `Failed to send message (Status: ${response.status}). Please try again or contact us directly.`
        setErrorMessage(errorMsg)
        setSubmitStatus("error")
        // Only log meaningful errors for debugging (not empty objects)
        if (data?.error && typeof data.error === 'string' && data.error.length > 0) {
          console.error("Form submission error:", data.error)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage("Network error. Please check your connection and try again.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">NAME</label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">EMAIL</label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="phone" className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">PHONE</label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="+94 XXX XXXXXX"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">COMPANY</label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="Company name"
          />
        </div>
      </div>

      <div ref={dropdownRef} className="relative">
        <label id="event-type-label" className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">EVENT TYPE</label>
        <button
          type="button"
          aria-labelledby="event-type-label"
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
            <div className="py-1 max-h-[240px] overflow-y-auto">
              {projectTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(type.value)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-muted transition-colors ${
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
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="message" className="text-xs tracking-[0.15em] text-muted-foreground">MESSAGE</label>
          <span className={`text-xs ${formData.message.length > 500 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {formData.message.length}/500
          </span>
        </div>
        <textarea
          id="message"
          rows={4}
          required
          maxLength={500}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors resize-none text-base placeholder:text-muted-foreground/50"
          placeholder="Tell us about your project..."
        />
      </div>

      {submitStatus === "success" && (
        <div className="text-green-600 dark:text-green-400 text-sm">
          Thank you! Your message has been sent successfully.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="text-red-600 dark:text-red-400 text-sm space-y-1">
          <p className="font-medium">Failed to send message.</p>
          {errorMessage && (
            <p className="text-xs opacity-90">{errorMessage}</p>
          )}
          {!errorMessage && (
            <p className="text-xs opacity-90">Please try again or contact us directly at info@imaginesl.com</p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-target w-full flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 rounded-full hover:bg-foreground/90 transition-colors text-sm font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        By contacting us, you agree to our{" "}
        <a href="/terms" className="text-foreground hover:underline font-medium">Terms of Service</a>
        {" "}and{" "}
        <a href="/privacy" className="text-foreground hover:underline font-medium">Privacy Policy</a>
      </p>
    </form>
  )
}

function MapSection() {
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
    <section 
      ref={ref} 
      className={`px-6 md:px-10 pb-8 md:pb-10 transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="rounded-2xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.287193906835!2d79.89516797399497!3d6.856139919210529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a8a95dd48b1%3A0xcbe65810955771f5!2sImagine%20Entertainment%20(Pvt)%20Ltd!5e0!3m2!1sen!2slk!4v1766860301232!5m2!1sen!2slk"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Imagine Entertainment Location"
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}
