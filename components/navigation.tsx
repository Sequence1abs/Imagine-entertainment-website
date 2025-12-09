"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const menuItems = [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
  ]

  const isDarkPage = pathname === "/" || pathname === "/about"
  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark")
  
  // Determine which logo to show
  const getLogoSource = () => {
    if (!mounted) return "/images/Imagine Logo Black Alpha.png"
    // If menu is open, always show white logo
    if (isOpen) return "/images/Imagine Logo White Alpha.png"
    // If scrolled, use theme-based logo
    if (scrolled) {
      return isDarkMode ? "/images/Imagine Logo White Alpha.png" : "/images/Imagine Logo Black Alpha.png"
    }
    // If on dark page, show white logo
    if (isDarkPage) return "/images/Imagine Logo White Alpha.png"
    // Otherwise use theme-based logo
    return isDarkMode ? "/images/Imagine Logo White Alpha.png" : "/images/Imagine Logo Black Alpha.png"
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isMounted && scrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent"
        }`}
        suppressHydrationWarning
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="relative z-50 flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <img
                src={getLogoSource()}
                alt="Imagine Entertainment"
                className="h-8 w-auto transition-all duration-300"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-12">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? scrolled
                        ? "text-foreground"
                        : isDarkPage
                          ? "text-white"
                          : "text-foreground"
                      : scrolled
                        ? "text-muted-foreground hover:text-foreground"
                        : isDarkPage
                          ? "text-white/70 hover:text-white"
                          : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              <Link
                href="/contact"
                className={`hidden lg:flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                  scrolled ? "text-foreground" : isDarkPage ? "text-white" : "text-foreground"
                }`}
              >
                Talk to Us
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative z-50 w-8 h-8 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-3 flex flex-col justify-between">
                  <span
                    className={`block h-[1.5px] w-full transition-all duration-400 ease-[cubic-bezier(0.77,0,0.175,1)] origin-center ${
                      isOpen
                        ? "bg-white rotate-45 translate-y-[5.25px]"
                        : scrolled
                          ? "bg-foreground"
                          : isDarkPage
                            ? "bg-white"
                            : "bg-foreground"
                    }`}
                  />
                  <span
                    className={`block h-[1.5px] w-full transition-all duration-400 ease-[cubic-bezier(0.77,0,0.175,1)] origin-center ${
                      isOpen
                        ? "bg-white -rotate-45 -translate-y-[5.25px]"
                        : scrolled
                          ? "bg-foreground"
                          : isDarkPage
                            ? "bg-white"
                            : "bg-foreground"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-foreground text-foreground transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-10">
          <div className="space-y-2">
            {[...menuItems, { label: "Contact", href: "/contact" }].map((item, index) => (
              <div
                key={item.label}
                className="overflow-hidden"
                style={{
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateY(0)" : "translateY(100%)",
                  transition: `all 0.5s cubic-bezier(0.77, 0, 0.175, 1) ${isOpen ? index * 0.08 : 0}s`,
                }}
              >
                <Link href={item.href} onClick={() => setIsOpen(false)} className="block py-2">
                  <span className="text-4xl md:text-5xl font-medium text-foreground hover:text-foreground/60 transition-colors duration-300">
                    {item.label}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
