"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { socialLinks } from "@/lib/socials"

// Filled social media icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark")
  const logoSource = mounted 
    ? (isDarkMode ? "/Imagine Logo White Alpha.png" : "/Imagine Logo Black Alpha.png")
    : "/Imagine Logo Black Alpha.png"

  return (
    <footer className="bg-background text-foreground border-t border-border mt-6">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
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
          </div>

          {/* Navigation */}
          <div>
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
          </div>

          {/* Services */}
          {/* Quick Contact */}
          <div>
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
          </div>

          {/* Social */}
          <div>
            <p className="text-xs tracking-[0.15em] text-foreground/50 mb-4">FOLLOW US</p>
            <div className="flex items-center gap-4">
              {mounted ? (
                <>
                  <a
                    href={socialLinks.facebook}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
                    aria-label="Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FacebookIcon className="w-6 h-6" />
                  </a>
                  <a
                    href={socialLinks.instagram}
                    className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors duration-300"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <InstagramIcon className="w-6 h-6" />
                  </a>
                  <a
                    href={socialLinks.linkedin}
                    className="text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors duration-300"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedInIcon className="w-6 h-6" />
                  </a>
                  <a
                    href={socialLinks.twitter}
                    className="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 transition-colors duration-300"
                    aria-label="Twitter"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TwitterIcon className="w-6 h-6" />
                  </a>
                </>
              ) : (
                // Placeholder to prevent layout shift
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6" />
                  <div className="w-6 h-6" />
                  <div className="w-6 h-6" />
                  <div className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>
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
