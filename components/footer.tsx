"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useTheme } from "next-themes"

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark")
  const logoSource = mounted 
    ? (isDarkMode ? "/images/Imagine Logo White Alpha.png" : "/images/Imagine Logo Black Alpha.png")
    : "/images/Imagine Logo Black Alpha.png"

  return (
    <footer className="bg-background text-foreground border-t border-border mt-6">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <img 
              src={logoSource}
              alt="Imagine Entertainment" 
              className="h-12 w-auto mb-4 transition-all duration-300" 
            />
            <p className="text-foreground/70 text-sm leading-relaxed max-w-xs">
              Creating extraordinary experiences for corporate events, television, film, and theatre worldwide.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-[0.15em] text-foreground/50 mb-4">COMPANY</p>
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
          <div>
            <p className="text-xs tracking-[0.15em] text-foreground/50 mb-4">SERVICES</p>
            <ul className="space-y-3">
              {["Corporate Events", "Television & Film", "Theatre", "Technical Production"].map((item) => (
                <li key={item}>
                  <Link
                    href="/services"
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs tracking-[0.15em] text-foreground/50 mb-4">CONNECT</p>
            <ul className="space-y-3">
              {["Instagram", "LinkedIn", "Twitter"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 inline-flex items-center gap-1"
                  >
                    {item}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>


        <div className="border-t border-border py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
          <p>© 2025 IMAGINE ENTERTAINMENT. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
