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
    // Core Brand Keywords
    "Imagine Entertainment",
    "Imagine Entertainment Sri Lanka",
    "Imagine Entertainment Pvt Ltd",
    "Imagine Events",
    "Imagine Event Production",
    "imaginesl",
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
    // Technical & AV Services
    "Professional Sound & Lighting",
    "Stage Design & Setup",
    "LED Wall Solutions",
    "LED Screen Rental Sri Lanka",
    "Audiovisual Production",
    "AV Equipment Rental",
    "Event Technical Partner",
    "Show Production Services",
    "Concert Production",
    "Festival Production",
    "Sound System Rental",
    "Stage Lighting Design",
    "Truss & Rigging Services",
    "Video Wall Rental",
    "PA System Rental Sri Lanka",
    // Concert & Music Events
    "Concert Production Sri Lanka",
    "Music Festival Production",
    "Live Concert Management",
    "Artist Tour Production",
    "Outdoor Concert Setup",
    "Indoor Concert Production",
    // Creative & Experience
    "Immersive Event Experiences",
    "Experiential Marketing",
    "Creative Event Design",
    "Bespoke Event Experiences",
    "Premium Event Styling",
    "Event Decor & Design",
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
    // Weddings & Private
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
    // Authority Keywords
    "Award-Winning Event Production",
    "Industry-Leading Event Experts",
    "Trusted Technical Partner",
    "Professional Event Team",
    "37+ Years of Experience",
    "High-End Event Production",
    "Best Event Company Sri Lanka",
    "Top Event Planners Sri Lanka",
    // Service Specific
    "Stage Rental Sri Lanka",
    "Event Equipment Hire",
    "Backdrop Design",
    "Event Furniture Rental",
    "Pyrotechnics & Special Effects"
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
    icon: [
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
        ║  Developed by Skynet Labs                                           ║
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
