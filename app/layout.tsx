import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "IMAGINE ENTERTAINMENT | Sri Lanka's Premier Event Production Company",
  description:
    "With over 37 years of excellence, Imagine Entertainment delivers world-class event production across Sri Lanka. From corporate galas and musical concerts to television production, weddings, and stadium-scale events — we bring extraordinary visions to life.",
  keywords: [
    "Event Production Sri Lanka",
    "Corporate Events",
    "Concert Production",
    "Television Production",
    "Film Production",
    "Wedding Planning Sri Lanka",
    "Stage Lighting",
    "Audio Visual",
    "Rigging Services",
    "Live Events",
    "Imagine Entertainment",
  ],
  authors: [{ name: "Imagine Entertainment (Pvt) Ltd" }],
  creator: "Imagine Entertainment",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.imaginesl.com/",
    title: "IMAGINE ENTERTAINMENT | Sri Lanka's Premier Event Production",
    description: "37+ years of creating extraordinary experiences. Corporate events, concerts, TV production, weddings & major events across Sri Lanka.",
    siteName: "Imagine Entertainment",
  },
  twitter: {
    card: "summary_large_image",
    title: "IMAGINE ENTERTAINMENT",
    description: "Sri Lanka's premier event production company. 37+ years of excellence in corporate events, concerts, TV production & more.",
    creator: "@imagineentertainment",
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

import { AutoLogoutListener } from "@/components/auth/auto-logout-listener"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        <AutoLogoutListener />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
