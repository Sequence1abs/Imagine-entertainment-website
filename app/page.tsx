import dynamic from "next/dynamic"
import Hero from "@/components/hero"
import Footer from "@/components/footer"
import PublicLayout from "@/components/layouts/public-layout"

// Dynamic imports for client components - they load in parallel after initial render
const ServicesGrid = dynamic(() => import("@/components/home/services-grid-v2").then(mod => ({ default: mod.ServicesGrid })))
const StatsSection = dynamic(() => import("@/components/home/stats-section").then(mod => ({ default: mod.StatsSection })))
const ExpertiseSection = dynamic(() => import("@/components/home/expertise-section").then(mod => ({ default: mod.ExpertiseSection })))
const StatementReveal = dynamic(() => import("@/components/home/statement-reveal").then(mod => ({ default: mod.StatementReveal })))
const CTASection = dynamic(() => import("@/components/home/cta-section").then(mod => ({ default: mod.CTASection })))
const ClientsMarquee = dynamic(() => import("@/components/clients-marquee"))
const Testimonials = dynamic(() => import("@/components/testimonials"))

// ... imports

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Imagine Entertainment (Pvt) Ltd | Sri Lanka's Premier Event Production Company",
  description: "With over 37 years of excellence, Imagine Entertainment delivers world-class event production across Sri Lanka. From corporate galas, musical concerts, and awards ceremonies to television production, weddings, and stadium-scale events — we bring extraordinary visions to life.",
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
// ...
  return (
    <PublicLayout>
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <Hero />

        {/* Philosophy section */}
        <section id="philosophy" className="pt-20 md:pt-28 pb-10 md:pb-14 px-6 md:px-10">
          <div className="max-w-[1400px] mx-auto">
            <StatementReveal />
          </div>
        </section>

        {/* Services Bento Grid */}
        <ServicesGrid />

        {/* Expertise Section */}
        <ExpertiseSection />

        {/* Clients & Testimonials */}
        <ClientsMarquee />
        <Testimonials />

        <StatsSection />

        {/* Pre-footer CTA */}
        <CTASection />

        <Footer />
      </main>
    </PublicLayout>
  )
}
