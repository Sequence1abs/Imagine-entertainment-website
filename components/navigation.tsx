"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
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
    { label: "Services", href: "/services", hasDropdown: true },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
  ]

  const servicesItems = [
    { label: "Corporate Events", href: "/services#corporate-events", number: "01" },
    { label: "Television & Film", href: "/services#television-and-film", number: "02" },
    { label: "Theatre Production", href: "/services#theatre-production", number: "03" },
  ]

  // Handle hover with delay to prevent flickering
  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current)
      servicesTimeoutRef.current = null
    }
    setServicesOpen(true)
  }

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false)
    }, 200) // Small delay to prevent flickering when moving between trigger and content
  }

  useEffect(() => {
    return () => {
      if (servicesTimeoutRef.current) {
        clearTimeout(servicesTimeoutRef.current)
      }
    }
  }, [])

  const isDarkPage = pathname === "/" || pathname === "/about"
  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark")
  const isHeroPage = pathname === "/"
  // Pages with hero sections (images/videos at the top): home page, about page, and work detail pages
  const hasHeroSection = pathname === "/" || pathname === "/about" || pathname.startsWith("/work/")
  
  // Determine which logo to show
  const getLogoSource = () => {
    if (!mounted) return "/Imagine Logo Black Alpha.png"
    // If menu is open, use theme-appropriate logo (consider both theme and page background)
    if (isOpen) {
      // If on dark page or dark mode, show white logo
      return (isDarkMode || isDarkPage) ? "/Imagine Logo White Alpha.png" : "/Imagine Logo Black Alpha.png"
    }
    // If scrolled, use theme-based logo
    if (scrolled) {
      return isDarkMode ? "/Imagine Logo White Alpha.png" : "/Imagine Logo Black Alpha.png"
    }
    // On work detail page with hero image: show white logo when not scrolled
    if (pathname.startsWith("/work/") && !scrolled) return "/Imagine Logo White Alpha.png"
    // If on dark page, show white logo
    if (isDarkPage) return "/Imagine Logo White Alpha.png"
    // Otherwise use theme-based logo
    return isDarkMode ? "/Imagine Logo White Alpha.png" : "/Imagine Logo Black Alpha.png"
  }

  // Determine icon color for hero page
  const getIconColor = () => {
    // When menu is open, the menu overlay has a background, so use foreground color
    if (isOpen) {
      return "text-foreground"
    }
    // On hero page: white when not scrolled, dark when scrolled
    if (isHeroPage) return scrolled ? "text-foreground" : "text-white"
    // On work detail page with hero image: white when not scrolled
    if (pathname.startsWith("/work/") && !scrolled) return "text-white"
    // If scrolled, use theme-based color
    if (scrolled) return "text-foreground"
    // If on dark page, use white
    if (isDarkPage) return "text-white"
    // Otherwise use theme-based color (black in light mode)
    return "text-black dark:text-foreground"
  }

  // Determine theme toggle icon color - keep consistent, don't change on scroll
  const getThemeToggleColor = () => {
    // When menu is open, use foreground color (visible on menu overlay background)
    if (isOpen) return "foreground"
    // On hero page: white when not scrolled
    if (isHeroPage && !scrolled) return "white"
    // On work detail page with hero image: white when not scrolled
    if (pathname.startsWith("/work/") && !scrolled) return "white"
    // If on dark page, use white
    if (isDarkPage && !scrolled) return "white"
    // If scrolled, use theme-based color
    if (scrolled) return isDarkMode ? "white" : "foreground"
    // Otherwise use foreground (consistent regardless of scroll)
    return "foreground"
  }

  const iconColor = getIconColor()
  const themeToggleColor = getThemeToggleColor()

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          mounted && scrolled
            ? isDarkMode
              ? "bg-black/95 backdrop-blur-md"
              : "bg-white/95 backdrop-blur-md"
            : "bg-transparent"
        }`}
        style={{ 
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'background-color, backdrop-filter',
          isolation: 'isolate'
        }}
        suppressHydrationWarning
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10" suppressHydrationWarning>
          <div className="flex items-center justify-between h-16 md:h-20 min-h-[4rem] md:min-h-[5rem] w-full" suppressHydrationWarning>
            <Link href="/" className="relative z-50 flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <img
                src={getLogoSource()}
                alt="Imagine Entertainment"
                className="h-8 w-auto transition-all duration-300"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-12" suppressHydrationWarning>
              {menuItems.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <DropdownMenu
                      key={item.label}
                      open={servicesOpen}
                      onOpenChange={setServicesOpen}
                      modal={false}
                    >
                      <div
                        onMouseEnter={handleServicesMouseEnter}
                        onMouseLeave={handleServicesMouseLeave}
                        className="relative"
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`text-sm font-medium transition-colors duration-300 flex items-center gap-1.5 ${
                              pathname === item.href || pathname.startsWith("/services")
                                ? scrolled
                                  ? "text-foreground"
                                  : isDarkPage || (pathname.startsWith("/work/") && !scrolled)
                                    ? "text-white"
                                    : "text-foreground"
                                : scrolled
                                  ? "text-muted-foreground hover:text-foreground"
                                  : isDarkPage || (pathname.startsWith("/work/") && !scrolled)
                                    ? "text-white/70 hover:text-white"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {item.label}
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                servicesOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          sideOffset={12}
                          className="w-64 bg-background/80 dark:bg-background/80 backdrop-blur-md border border-border/50 shadow-lg rounded-lg p-4 min-w-[240px]"
                          onMouseEnter={handleServicesMouseEnter}
                          onMouseLeave={handleServicesMouseLeave}
                        >
                          <div className="space-y-0">
                            {servicesItems.map((service) => (
                              <DropdownMenuItem
                                key={service.label}
                                asChild
                                className="focus:bg-transparent p-0 m-0"
                              >
                                <Link
                                  href={service.href}
                                  className="cursor-pointer flex items-center px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors"
                                  onClick={() => setServicesOpen(false)}
                                >
                                  <span className="text-sm font-medium text-foreground">
                                    {service.label}
                                  </span>
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
                          <DropdownMenuSeparator className="my-2" />
                          <DropdownMenuItem asChild className="focus:bg-transparent p-0 m-0">
                            <Link
                              href="/services"
                              className="cursor-pointer flex items-center justify-between gap-2 px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors"
                              onClick={() => setServicesOpen(false)}
                            >
                              <span className="text-sm font-medium text-foreground">
                                View All Services
                              </span>
                              <ArrowUpRight className="w-4 h-4 text-foreground" />
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </div>
                    </DropdownMenu>
                  )
                }
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-sm font-medium transition-colors duration-300 ${
                      pathname === item.href
                        ? scrolled
                          ? "text-foreground"
                          : isDarkPage || (pathname.startsWith("/work/") && !scrolled)
                            ? "text-white"
                            : "text-foreground"
                        : scrolled
                          ? "text-muted-foreground hover:text-foreground"
                          : isDarkPage || (pathname.startsWith("/work/") && !scrolled)
                            ? "text-white/70 hover:text-white"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 min-w-fit" suppressHydrationWarning>
              <div className="flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center">
                <ThemeToggle 
                  iconColor={scrolled ? (isDarkMode ? "white" : "foreground") : themeToggleColor} 
                  noGlass={scrolled} 
                />
              </div>
              
              <Link
                href="/contact"
                className={`hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex-shrink-0 ${
                  scrolled || !hasHeroSection
                    ? isDarkMode
                      ? "bg-white text-black hover:bg-white/90 border border-white"
                      : "bg-black text-white hover:bg-black/90 border border-black"
                    : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
                }`}
              >
                Talk to Us
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative z-50 w-8 h-8 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <Menu 
                  className={`w-5 h-5 transition-all duration-300 absolute ${iconColor} ${
                    isOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
                  }`} 
                />
                <X 
                  className={`w-5 h-5 transition-all duration-300 absolute ${iconColor} ${
                    isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-background dark:bg-background text-foreground dark:text-foreground backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        suppressHydrationWarning
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-10" suppressHydrationWarning>
          <div className="space-y-2" suppressHydrationWarning>
            {menuItems.map((item, index) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="overflow-hidden"
                    suppressHydrationWarning
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateY(0)" : "translateY(100%)",
                      transition: `all 0.5s cubic-bezier(0.77, 0, 0.175, 1) ${isOpen ? index * 0.08 : 0}s`,
                    }}
                  >
                    <div className="py-2">
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block mb-3"
                      >
                        <span className="text-4xl md:text-5xl font-medium text-foreground dark:text-foreground hover:opacity-60 dark:hover:opacity-80 transition-opacity duration-300">
                          {item.label}
                        </span>
                      </Link>
                      <div className="pl-4 space-y-1">
                        {servicesItems.map((service, serviceIndex) => (
                          <div
                            key={service.label}
                            className="overflow-hidden"
                            suppressHydrationWarning
                            style={{
                              opacity: isOpen ? 1 : 0,
                              transform: isOpen ? "translateY(0)" : "translateY(100%)",
                              transition: `all 0.5s cubic-bezier(0.77, 0, 0.175, 1) ${
                                isOpen ? index * 0.08 + (serviceIndex + 1) * 0.05 : 0
                              }s`,
                            }}
                          >
                            <Link
                              href={service.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-1"
                            >
                              <span className="text-xl md:text-2xl font-normal text-muted-foreground hover:text-foreground dark:hover:text-foreground transition-colors duration-300">
                                {service.label}
                              </span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <div
                  key={item.label}
                  className="overflow-hidden"
                  suppressHydrationWarning
                  style={{
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateY(0)" : "translateY(100%)",
                    transition: `all 0.5s cubic-bezier(0.77, 0, 0.175, 1) ${isOpen ? index * 0.08 : 0}s`,
                  }}
                >
                  <Link href={item.href} onClick={() => setIsOpen(false)} className="block py-2">
                    <span className="text-4xl md:text-5xl font-medium text-foreground dark:text-foreground hover:opacity-60 dark:hover:opacity-80 transition-opacity duration-300">
                      {item.label}
                    </span>
                  </Link>
                </div>
              )
            })}
            <div
              className="overflow-hidden"
              suppressHydrationWarning
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(100%)",
                transition: `all 0.5s cubic-bezier(0.77, 0, 0.175, 1) ${isOpen ? menuItems.length * 0.08 : 0}s`,
              }}
            >
              <Link href="/contact" onClick={() => setIsOpen(false)} className="block py-2">
                <span className="text-4xl md:text-5xl font-medium text-foreground dark:text-foreground hover:opacity-60 dark:hover:opacity-80 transition-opacity duration-300">
                  Contact
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
