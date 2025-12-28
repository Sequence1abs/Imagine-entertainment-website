import Navigation from "@/components/navigation"
import { CookieConsent } from "@/components/cookie-consent"
import CursorProvider from "@/components/cursor-provider"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <CursorProvider />
      <Navigation />
      {children}
      <CookieConsent />
    </>
  )
}
