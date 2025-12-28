"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { socialLinks } from "@/lib/socials"

// Animation variants for smooth, optimized animations
const navVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    backgroundColor: "rgba(0, 0, 0, 0)",
    backdropFilter: "blur(0px)",
  },
  transparent: {
    opacity: 1,
    y: 0,
    backgroundColor: "rgba(0, 0, 0, 0)",
    backdropFilter: "blur(0px)",
  },
  scrolledDark: {
    opacity: 1,
    y: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(20px)",
  },
  scrolledLight: {
    opacity: 1,
    y: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
  },
}

const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.77, 0, 0.175, 1] as const,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.77, 0, 0.175, 1] as const,
    },
  },
}

const menuContainerVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const menuItemVariants: Variants = {
  closed: {
    opacity: 0,
    y: 40,
    transition: {
      duration: 0.3,
      ease: [0.77, 0, 0.175, 1] as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.77, 0, 0.175, 1] as const,
    },
  },
}

const subMenuItemVariants: Variants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
      ease: [0.77, 0, 0.175, 1] as const,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.77, 0, 0.175, 1] as const,
    },
  },
}

const hamburgerVariants = {
  closed: { rotate: 0, scale: 1 },
  open: { rotate: 90, scale: 0 },
}

const closeVariants = {
  closed: { rotate: -90, scale: 0 },
  open: { rotate: 0, scale: 1 },
}

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
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
    { label: "Rigging Services", href: "/services#rigging-services", number: "04" },
    { label: "Public, Sports & Major Events", href: "/services#public-sports-and-major-events", number: "05" },
    { label: "Fixed Installation", href: "/services#fixed-installation", number: "06" },
    { label: "Weddings & Private Celebrations", href: "/services#weddings-and-private-celebrations", number: "07" },
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
    }, 200)
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
  const hasHeroSection = pathname === "/" || pathname === "/about" || pathname.startsWith("/work/")
  
  // Determine which logo to show
  const getLogoSource = () => {
    if (!mounted) return "/Imagine_logo_black_long.png"
    // When mobile menu is open, use theme-based logo (menu background matches theme)
    if (isOpen) {
      return isDarkMode ? "/Imagine_logo_white_long.png" : "/Imagine_logo_black_long.png" 
    }
    if (scrolled) {
      return isDarkMode ? "/Imagine_logo_white_long.png" : "/Imagine_logo_black_long.png"
    }
    if (pathname.startsWith("/work/") && !scrolled) return "/Imagine_logo_white_long.png"
    if (isDarkPage) return "/Imagine_logo_white_long.png"
    return isDarkMode ? "/Imagine_logo_white_long.png" : "/Imagine_logo_black_long.png"
  }

  // Icon color: white on hero pages when not scrolled, foreground otherwise
  const getIconColor = () => {
    if (isOpen) return "text-foreground"
    if (hasHeroSection && !scrolled) return "text-white"
    return "text-foreground"
  }

  // Theme toggle color: white on hero pages when not scrolled, foreground otherwise
  const getThemeToggleColor = () => {
    if (isOpen) return isDarkMode ? "white" : "foreground"
    if (hasHeroSection && !scrolled) return "white"
    return isDarkMode ? "white" : "foreground"
  }

  // Check if nav should use "hero mode" styling (white text on dark background)
  const isHeroMode = hasHeroSection && !scrolled && !isOpen

  // Nav link color based on hero mode
  const getNavLinkClass = (isActive: boolean) => {
    if (isHeroMode) {
      return isActive ? "text-white" : "text-white/70 hover:text-white"
    }
    return isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
  }

  // Nav background: transparent when not scrolled or when mobile menu is open
  const getNavAnimationState = () => {
    if (isOpen) return "transparent"
    if (!mounted || !scrolled) return "transparent"
    return isDarkMode ? "scrolledDark" : "scrolledLight"
  }

  const iconColor = getIconColor()
  const themeToggleColor = getThemeToggleColor()

  return (
    <>
      <motion.nav
        initial="hidden"
        animate={mounted ? getNavAnimationState() : "hidden"}
        variants={navVariants}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.1, 0.25, 1],
          opacity: { duration: 0.5, delay: 0.1 },
          y: { duration: 0.5, delay: 0.1 },
          backgroundColor: { duration: 0.4, ease: "easeInOut" },
          backdropFilter: { duration: 0.6, ease: "easeOut" }
        }}
        className="fixed top-0 left-0 right-0 z-50"
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
              <motion.img
                src={getLogoSource()}
                alt="Imagine Entertainment"
                className="h-10 md:h-11 w-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                key={getLogoSource()}
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
                          <div className="flex items-center gap-1.5">
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Link
                                href="/services"
                                className={`text-sm font-medium transition-colors duration-300 ${getNavLinkClass(
                                  pathname === item.href || pathname.startsWith("/services")
                                )}`}
                              >
                                {item.label}
                              </Link>
                            </motion.div>
                            <motion.div
                              animate={{ rotate: servicesOpen ? 180 : 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              className={`cursor-pointer ${getNavLinkClass(false)}`}
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </motion.div>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          sideOffset={10}
                          className="bg-background/90 dark:bg-background/90 backdrop-blur-xl border border-border shadow-xl rounded-xl p-3"
                          onMouseEnter={handleServicesMouseEnter}
                          onMouseLeave={handleServicesMouseLeave}
                        >
                          <div className="grid grid-cols-2 gap-x-3">
                            {/* Column 1 */}
                            <div>
                              {servicesItems.slice(0, 4).map((service) => (
                                <DropdownMenuItem
                                  key={service.label}
                                  asChild
                                  className="focus:bg-transparent p-0 m-0"
                                >
                                  <Link
                                    href={service.href}
                                    className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-foreground hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
                                    onClick={() => setServicesOpen(false)}
                                  >
                                    <span>{service.label}</span>
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </div>
                            {/* Column 2 */}
                            <div>
                              {servicesItems.slice(4).map((service) => (
                                <DropdownMenuItem
                                  key={service.label}
                                  asChild
                                  className="focus:bg-transparent p-0 m-0"
                                >
                                  <Link
                                    href={service.href}
                                    className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-foreground hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
                                    onClick={() => setServicesOpen(false)}
                                  >
                                    <span>{service.label}</span>
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                              {/* View All Services as 4th item in column 2 */}
                              <DropdownMenuItem asChild className="focus:bg-transparent p-0 m-0">
                                <Link
                                  href="/services"
                                  className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
                                  onClick={() => setServicesOpen(false)}
                                >
                                  <span>View All Services</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                              </DropdownMenuItem>
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </div>
                    </DropdownMenu>
                  )
                }
                return (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={item.href}
                      className={`text-sm font-medium transition-colors duration-300 ${getNavLinkClass(
                        pathname === item.href
                      )}`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
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
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="hidden lg:block"
              >
                <Link
                  href="/contact"
                  className={`cursor-target flex items-center gap-2 h-11 md:h-12 px-6 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-2xl ${
                    isHeroMode || isDarkMode
                      ? "bg-white text-black hover:bg-white/90 border-2 border-white"
                      : "bg-black text-white hover:bg-black/90 border-2 border-black"
                  }`}
                >
                  <span>Talk to Us</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
                </Link>
              </motion.div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative z-50 w-8 h-8 flex items-center justify-center"
                aria-label="Toggle menu"
              >
                <motion.div
                  initial={false}
                  animate={isOpen ? "open" : "closed"}
                  className="absolute"
                >
                  <motion.div
                    variants={hamburgerVariants}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Menu className={`w-5 h-5 ${iconColor}`} />
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={false}
                  animate={isOpen ? "open" : "closed"}
                  className="absolute"
                >
                  <motion.div
                    variants={closeVariants}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <X className={`w-5 h-5 ${iconColor}`} />
                  </motion.div>
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu with AnimatePresence for smooth enter/exit */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 bg-background/95 dark:bg-black/90 text-foreground dark:text-foreground backdrop-blur-md supports-[backdrop-filter]:bg-background/95"
            suppressHydrationWarning
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.2, bottom: 0.05 }}
            onDragEnd={(e, { offset, velocity }) => {
              const swipeUp = offset.y < -100 || velocity.y < -500
              if (swipeUp) {
                setIsOpen(false)
              }
            }}
          >
            <div className="h-full flex flex-col px-6 md:px-10 pb-8 pt-24 overflow-y-auto no-scrollbar" suppressHydrationWarning>
              <div className="flex-1 flex flex-col justify-start space-y-6">
                {menuItems.map((item) => {
                  if (item.hasDropdown) {
                    return (
                      <motion.div
                        key={item.label}
                        variants={menuItemVariants}
                        className="overflow-hidden"
                        suppressHydrationWarning
                      >
                        <div className="py-1">
                          <button
                            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                            className="flex items-center justify-between w-full text-left group"
                          >
                            <motion.span 
                              className="text-2xl sm:text-3xl md:text-4xl font-normal text-foreground"
                              transition={{ duration: 0.2 }}
                            >
                              {item.label}
                            </motion.span>
                            <motion.div
                              animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-muted-foreground group-hover:text-foreground transition-colors"
                            >
                              <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                            </motion.div>
                          </button>
                          
                          <motion.div 
                            initial={false}
                            animate={{ 
                              height: mobileServicesOpen ? "auto" : 0,
                              opacity: mobileServicesOpen ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-3 mt-4 mb-2 pl-2">
                              {servicesItems.map((service, index) => (
                                <motion.div
                                  key={service.label}
                                  initial={{ x: -10, opacity: 0 }}
                                  animate={mobileServicesOpen ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.03 }}
                                >
                                  <Link
                                    href={service.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block group"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors font-light">
                                        {service.label}
                                      </span>
                                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                                      </span>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                              
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={mobileServicesOpen ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.2, delay: servicesItems.length * 0.03 }}
                                className="pt-2"
                              >
                                <Link
                                  href="/services"
                                  onClick={() => setIsOpen(false)}
                                  className="text-sm font-medium text-foreground flex items-center gap-2"
                                >
                                  View all services <ArrowUpRight className="w-3 h-3" />
                                </Link>
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )
                  }
                  return (
                    <motion.div
                      key={item.label}
                      variants={menuItemVariants}
                      className="overflow-hidden"
                      suppressHydrationWarning
                    >
                      <Link href={item.href} onClick={() => setIsOpen(false)} className="block py-1">
                        <div className="flex items-center justify-between group">
                          <motion.span 
                            className="text-2xl sm:text-3xl md:text-4xl font-normal text-foreground"
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Bottom Section: CTA & Socials */}
              <motion.div
                variants={menuContainerVariants}
                className="mt-8 flex flex-col gap-6"
              >
                <motion.div variants={menuItemVariants} className="w-full">
                  <Link href="/contact" onClick={() => setIsOpen(false)} className="block w-full cursor-target">
                    <motion.div 
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-base font-medium transition-all ${
                        isDarkMode 
                          ? "bg-white text-black hover:bg-white/90" 
                          : "bg-black text-white hover:bg-black/90"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Contact</span>
                    </motion.div>
                  </Link>
                </motion.div>
                
                <motion.div
                  variants={menuItemVariants}
                  className="flex items-center justify-center gap-8"
                  suppressHydrationWarning
                >
                  <a
                    href={socialLinks.facebook}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a
                    href={socialLinks.instagram}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a
                    href="https://tiktok.com/@imagineentertainment"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                  <a
                    href="https://youtube.com/@imagineentertainment"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
