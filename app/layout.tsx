import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navigation from "@/components/navigation"
import { CookieConsent } from "@/components/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import CursorProvider from "@/components/cursor-provider"

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
    url: "https://imagine-entertainment.com/",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CursorProvider />
        <Navigation />
        {children}
        <Analytics />
        <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
