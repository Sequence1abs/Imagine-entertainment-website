"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { socialLinks } from "@/lib/socials"
import { motion, useInView } from "framer-motion"

// Filled social media icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="facebook_grad" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#18ACFE" />
        <stop offset="1" stopColor="#1877F2" />
      </linearGradient>
    </defs>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="url(#facebook_grad)"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="instagram_grad" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#f09433" />
        <stop offset="0.5" stopColor="#dc2743" />
        <stop offset="1" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram_grad)"/>
  </svg>
)

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
)

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true, amount: 0.2 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark")
  const logoSource = mounted 
    ? (isDarkMode ? "/Imagine Logo White Alpha.png" : "/Imagine Logo Black Alpha.png")
    : "/Imagine Logo Black Alpha.png"

  return (
    <footer ref={footerRef} className="bg-background text-foreground border-t border-border mt-6">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Logo section - fade in */}
          <motion.div 
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={logoSource}
              alt="Imagine Entertainment" 
              className="h-16 md:h-20 w-auto mb-4 transition-all duration-300" 
            />
            <p className="text-foreground/90 text-base font-medium mb-2">
              Bringing stories to life
            </p>
            <p className="text-foreground/70 text-sm leading-relaxed max-w-xs">
              Creating extraordinary experiences for corporate events, television, film, and theatre worldwide.
            </p>
          </motion.div>

          {/* Navigation - staggered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs tracking-[0.15em] text-foreground/50 mb-4">QUICK LINKS</p>
            <ul className="space-y-3">
              {["About", "Work", "Services", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs tracking-[0.15em] text-foreground/50 mb-4 uppercase">Quick Contact</p>
            <address className="text-sm text-foreground/70 not-italic space-y-4 leading-relaxed">
              <p>
                No : 97 Delkanda,
                <br />
                Old Kesbewa Road,
                <br />
                Nugegoda 10250,
                <br />
                Sri Lanka.
              </p>
              <div className="space-y-1">
                <p>
                  Phone :{" "}
                  <a href="tel:+94717750744" className="hover:text-foreground transition-colors">
                    +94 717 750744
                  </a>
                </p>
                <p>
                  Email :{" "}
                  <a href="mailto:info@imaginesl.com" className="hover:text-foreground transition-colors">
                    info@imaginesl.com
                  </a>
                </p>
              </div>
            </address>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-xs tracking-[0.15em] text-foreground/50 mb-4">FOLLOW US</p>
            <div className="flex items-center gap-4">
              {mounted ? (
                <>
                  <a
                    href={socialLinks.facebook}
                    className="cursor-target flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300 hover:opacity-80"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={socialLinks.instagram}
                    className="cursor-target flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300 hover:opacity-80"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon className="w-5 h-5" />
                  </a>
                  <a
                    href="https://tiktok.com/@imagineentertainment"
                    className="cursor-target flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300 hover:opacity-80 text-black dark:text-white"
                    aria-label="TikTok"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com/@imagineentertainment"
                    className="cursor-target flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-all duration-300 hover:opacity-80 text-[#FF0000]"
                    aria-label="YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6" />
                  <div className="w-6 h-6" />
                  <div className="w-6 h-6" />
                  <div className="w-6 h-6" />
                </div>
              )}
            </div>
          </motion.div>
        </div>


        <div className="border-t border-border py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-foreground/50">
          <p className="order-2 md:order-1 text-center md:text-left">© IMAGINE ENTERTAINMENT (PVT) LTD. All rights reserved.</p>
          
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 order-1 md:order-2">
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-use" className="hover:text-foreground transition-colors">
                Terms of Use
              </Link>
            </div>
            
            <div className="hidden md:block h-3 w-px bg-foreground/20"></div>
            
            <p className="font-medium hover:text-foreground transition-colors cursor-default">
              Developed by TEAM SKYNET
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
