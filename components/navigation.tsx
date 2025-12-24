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
    { label: "Our Portfolio", href: "/work" },
    { label: "Services", href: "/services", hasDropdown: true },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
  ]

  const servicesItems = [
    { label: "Corporate Events", href: "/services#corporate", number: "01" },
    { label: "Television & Film Production", href: "/services#television-and-film-production", number: "02" },
    { label: "Musical Concert", href: "/services#musical-concert", number: "03" },
    { label: "Fixed Installation", href: "/services#fixed-installation", number: "04" },
    { label: "Weddings & Private Celebrations", href: "/services#weddings-and-private-celebrations", number: "05" },
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
    if (!mounted) return "/Imagine_logo_black_long.png"
    // If menu is open, use theme-appropriate logo (consider both theme and page background)
    if (isOpen) {
      // If on dark page or dark mode, show white logo
      return (isDarkMode || isDarkPage) ? "/Imagine_logo_white_long.png" : "/Imagine_logo_black_long.png" 
    }
    // If scrolled, use theme-based logo
    if (scrolled) {
      return isDarkMode ? "/Imagine_logo_white_long.png" : "/Imagine_logo_black_long.png"
    }
    // On work detail page with hero image: show white logo when not scrolled
    if (pathname.startsWith("/work/") && !scrolled) return "/Imagine_logo_white_long.png"
    // If on dark page, show white logo
    if (isDarkPage) return "/Imagine_logo_white_long.png"
    // Otherwise use theme-based logo
    return isDarkMode ? "/Imagine_logo_white_long.png" : "/Imagine_logo_black_long.png"
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
                className="h-8 md:h-9 w-auto transition-all duration-300"
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
                          className="w-64 bg-background/80 dark:bg-background/80 backdrop-blur-md border border-border shadow-lg rounded-xl p-2 min-w-[240px]"
                          onMouseEnter={handleServicesMouseEnter}
                          onMouseLeave={handleServicesMouseLeave}
                        >
                          <div className="space-y-1">
                            {servicesItems.map((service) => (
                              <DropdownMenuItem
                                key={service.label}
                                asChild
                                className="focus:bg-transparent p-0 m-0"
                              >
                                <Link
                                  href={service.href}
                                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                                  onClick={() => setServicesOpen(false)}
                                >
                                  <span>{service.label}</span>
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </div>
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
                className={`hidden lg:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex-shrink-0 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  scrolled || !hasHeroSection
                    ? isDarkMode
                      ? "bg-gradient-to-r from-white to-white/95 text-black hover:from-white/95 hover:to-white border-2 border-white"
                      : "bg-gradient-to-r from-black to-black/95 text-white hover:from-black/95 hover:to-black border-2 border-black"
                    : "bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:from-white/30 hover:to-white/20 hover:border-white/40"
                }`}
              >
                <span className="relative">
                  Talk to Us
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </span>
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
