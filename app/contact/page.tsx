"use client"

import { useEffect, useState, useRef } from "react"
import type React from "react"
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
            <div className="overflow-hidden mb-3">
              <p
                className={`text-white/50 dark:text-white/70 text-xs tracking-[0.15em] transition-all duration-700 ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                }`}
              >
                GET IN TOUCH
              </p>
            </div>
            <h1>
              <div className="overflow-hidden">
                <span
                  className={`block text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-white dark:text-white transition-all duration-700 ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                  }`}
                  style={{ transitionDelay: "0.15s" }}
                >
                  Let's Create Something
                  <br />
                  <span className="italic font-normal text-white/80 dark:text-white/70">Extraordinary</span>
                </span>
              </div>
            </h1>
          </div>
        </div>
      </section>

      <section className="pt-12 md:pt-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
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
                  href="mailto:info@imaginesl.com"
                  className="text-2xl md:text-3xl font-medium hover:text-muted-foreground transition-colors"
                >
                  info@imaginesl.com
                </a>
              </div>

              <div>
                <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Phone</p>
                <a
                  href="tel:+94717750744"
                  className="text-2xl md:text-3xl font-medium hover:text-muted-foreground transition-colors"
                >
                  +94 717 750744
                </a>
              </div>

              <div>
                <p className="text-xs tracking-[0.15em] text-muted-foreground mb-4">//Location</p>
                <address className="text-lg font-medium not-italic leading-relaxed">
                  <p>No : 97 Delkanda,</p>
                  <p>Old Kesbewa Road,</p>
                  <p>Nugegoda 10250,</p>
                  <p>Sri Lanka.</p>
                </address>
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
          <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">NAME</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">EMAIL</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-transparent border-b border-border pb-3 focus:border-foreground outline-none transition-colors text-base placeholder:text-muted-foreground/50"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs tracking-[0.15em] text-muted-foreground mb-3">COMPANY</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
          required
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
        className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full hover:bg-foreground/90 transition-colors text-sm font-medium mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </button>
    </form>
  )
}
