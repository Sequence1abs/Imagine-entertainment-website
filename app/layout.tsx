import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from "@/components/seo/google-analytics"
import { JsonLd } from "@/components/seo/json-ld"
import { AutoLogoutListener } from "@/components/auth/auto-logout-listener"
import { ConsoleWatermark } from "@/components/console-watermark"
import { cn } from "@/lib/utils"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Imagine Entertainment (Pvt) Ltd | Sri Lanka's Premier Event Production Company",
  description:
    "With over 37 years of excellence, Imagine Entertainment delivers world-class event production across Sri Lanka. From corporate galas, musical concerts, and awards ceremonies to television production, weddings, and stadium-scale events — we bring extraordinary visions to life.",
  keywords: [
    // Core Brand Keywords & Variations
    "Imagine Entertainment",
    "Imagine Sri Lanka",
    "Best Light Sounds Sri Lanka",
    "Imagine",
    "IMAGINE",
    "imagine",
    "Imagine Entertainment Sri Lanka",
    "Imagine Entertainment Pvt Ltd",
    "Imagine Events",
    "Imagine Event Production",
    "imaginesl",
    "Imagine SL",
    "Imagine Lanka",
    "The Imagine Team",
    
    // Broad Industry Terms
    "Events",
    "Entertainment",
    "Production",
    "Lights",
    "Sounds",
    "Stage",
    "Show",
    "Concert",
    "Live Events",
    "Show Business",
    
    // Specific Services - Lighting
    "Event Lighting",
    "Stage Lighting",
    "Concert Lighting",
    "Lighting Rental Sri Lanka",
    "Intelligent Lighting",
    "Light Show",
    "Lighting Design",
    
    // Specific Services - Sound
    "Professional Sound",
    "Sound System Rental",
    "Audio Rental Sri Lanka",
    "PA System Hire",
    "Concert Sound",
    "Line Array Systems",
    "Live Sound Engineering",
    
    // Specific Services - Visuals
    "LED Walls",
    "LED Screen Rental",
    "Video Mapping",
    "Projection Mapping",
    "Visual Effects",
    "Live Visuals",
    
    // Specific Services - Staging & Rigging
    "Stage Design",
    "Stage Construction",
    "Trussing",
    "Rigging Services",
    "Event Structures",
    "Platform Rental",
    
    // Event Production Services
    "Event Production Company",
    "Event Production Company Sri Lanka",
    "Event Management Company Sri Lanka",
    "Corporate Event Production",
    "Luxury Event Production",
    "End-to-End Event Solutions",
    "Turnkey Event Production",
    "Live Event Specialists",
    "Full Service Event Production",
    "Event Planning Sri Lanka",
    "Event Organizers Colombo",
    
    // Corporate Events
    "Corporate Galas",
    "Award Ceremonies",
    "Product Launches",
    "Brand Activations",
    "Conferences & Summits",
    "Corporate Entertainment Solutions",
    "Corporate Events Colombo",
    "Company Annual Dinners",
    "AGM Event Production",
    "Trade Show Production",
    "Exhibition Stand Design",
    
    // Concert & Music Events
    "Concert Production Sri Lanka",
    "Music Festival Production",
    "Live Concert Management",
    "Artist Tour Production",
    "Outdoor Concert Setup",
    "Indoor Concert Production",
    
    // Weddings & Private Celebrations
    "Weddings Sri Lanka",
    "Wedding Planning Sri Lanka",
    "Destination Weddings Sri Lanka",
    "Luxury Wedding Production",
    "Wedding Stage Design",
    "Private Party Production",
    
    // Broadcast & Virtual
    "Broadcast Production",
    "Live Streaming Services",
    "Hybrid Events",
    "Virtual Event Production",
    "Television Production Sri Lanka",
    "Film Production Sri Lanka",
    "TV Show Production",
    "Reality TV Production",
    
    // Location Keywords
    "Event Production Sri Lanka",
    "Colombo Event Production",
    "Sri Lanka Event Specialists",
    "Event Company Nugegoda",
    "Events Colombo",
    "Event Planners Western Province",
    "Events in Sri Lanka",
    "Colombo Events",
    
    // Authority Keywords
    "Award-Winning Event Production",
    "Industry-Leading Event Experts",
    "Trusted Technical Partner",
    "Professional Event Team",
    "37+ Years of Experience",
    "High-End Event Production",
    "Best Event Company Sri Lanka",
    "Top Event Planners Sri Lanka",
    "Premier Event Company",
    "No 1 Event Company Sri Lanka"
  ],
  authors: [{ name: "Imagine Entertainment (Pvt) Ltd" }],
  creator: "Imagine Entertainment",
  publisher: "Imagine Entertainment",
  verification: {
    google: "FsaEPcmDwm7kcUTfP0txTgyfXQ_zOoghOKGXCL0f9lc",
  },
  metadataBase: new URL('https://www.imaginesl.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.imaginesl.com/",
    title: "Imagine Entertainment (Pvt) Ltd | Sri Lanka's Premier Event Production",
    description: "With over 37 years of excellence, Imagine Entertainment delivers world-class event production across Sri Lanka. From corporate galas, concerts, and awards ceremonies to TV production and weddings.",
    siteName: "Imagine Entertainment (Pvt) Ltd",
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Imagine Entertainment (Pvt) Ltd - Sri Lanka Premier Event Production Company'
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Imagine Entertainment (Pvt) Ltd | Event Production Specialists",
    description: "Sri Lanka's premier event production company. 37+ years of excellence in corporate events, concerts, TV production & more.",
    // creator: "@imagineentertainment", // Uncomment if valid handle exists
    images: ['/og-image.jpg']
  },
  icons: {
    // SVG favicon - Google's preferred format for search results
    icon: [
      { url: "/imagine_favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      {/* 
        ═══════════════════════════════════════════════════════════════════════
        ║  Property of IMAGINE ENTERTAINMENT (PVT) LTD.                       ║
        ║  Website: https://www.imaginesl.com                                 ║
        ║  Developed by Sequence Labs                                           ║
        ║  https://www.linkedin.com/in/tharukakarunanayaka/                   ║
        ║  https://www.linkedin.com/in/hasal/                                 ║
        ║  © 2026 All Rights Reserved                                         ║
        ═══════════════════════════════════════════════════════════════════════
      */}
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={cn("font-sans antialiased overflow-x-hidden", outfit.variable)} suppressHydrationWarning>
        <ConsoleWatermark />
        <AutoLogoutListener />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <JsonLd />
          <GoogleAnalytics />
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
