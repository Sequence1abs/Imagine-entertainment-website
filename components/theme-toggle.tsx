"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { flushSync } from "react-dom"

interface ThemeToggleProps {
  iconColor?: "white" | "foreground"
  noGlass?: boolean
}

export function ThemeToggle({ iconColor = "foreground", noGlass = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")
  const iconClass = iconColor === "white" 
    ? "text-white" 
    : "text-black dark:text-foreground"

  const glassClasses = noGlass
    ? "border border-transparent"
    : "md:bg-white/10 md:backdrop-blur-md border border-transparent md:border-white/20 md:hover:bg-white/20"

  const toggleTheme = () => {
    if (
      !document.startViewTransition || 
      typeof document.startViewTransition !== 'function' ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(isDark ? "light" : "dark")
      return
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDark ? "light" : "dark")
      })
    })
  }

  if (!mounted) {
    return (
      <button
        className={`cursor-target relative h-[42px] w-[42px] flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0 ${glassClasses}`}
        style={{ minWidth: '42px', minHeight: '42px' }}
        aria-label="Toggle theme"
      >
        <Sun className={`h-4 w-4 ${iconClass} flex-shrink-0`} />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`cursor-target relative h-[42px] w-[42px] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex-shrink-0 ${glassClasses}`}
      style={{ minWidth: '42px', minHeight: '42px' }}
      aria-label="Toggle theme"
    >
      <Sun className={`h-4 w-4 ${iconClass} rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 dark:opacity-0 absolute`} />
      <Moon className={`h-4 w-4 ${iconClass} rotate-90 scale-0 opacity-0 transition-all duration-500 dark:rotate-0 dark:scale-100 dark:opacity-100 absolute`} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

