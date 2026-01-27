"use client"

import { CookieConsent } from "@/components/cookie-consent"
import CursorProvider from "@/components/cursor-provider"
import NavigationWrapper from "@/components/navigation-wrapper"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CursorProvider />
      <NavigationWrapper />
      {children}
      <CookieConsent />
    </>
  )
}
