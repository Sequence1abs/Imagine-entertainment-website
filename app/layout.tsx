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
  title: "IMAGINE ENTERTAINMENT",
  description:
    "Full-service event production for corporate events, television, film, and theatre. We create extraordinary experiences that captivate audiences worldwide.",
  keywords: ["Event Production", "Corporate Events", "Concert Production", "Stage Lighting", "Audio Visual", "Sri Lanka", "Imagine Entertainment"],
  authors: [{ name: "Imagine Entertainment" }],
  creator: "Imagine Entertainment",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.imaginesl.com/",
    title: "IMAGINE ENTERTAINMENT",
    description: "Full-service event production for corporate events, television, film, and theatre.",
    siteName: "Imagine Entertainment",
  },
  twitter: {
    card: "summary_large_image",
    title: "IMAGINE ENTERTAINMENT",
    description: "Full-service event production for corporate events, television, film, and theatre.",
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
