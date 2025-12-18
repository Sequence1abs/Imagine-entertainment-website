"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  iconColor?: "white" | "foreground"
}

export function ThemeToggle({ iconColor = "foreground" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark")
  const iconClass = iconColor === "white" ? "text-white" : "text-foreground"

  if (!mounted) {
    return (
      <button
        className="relative h-9 w-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/20"
        aria-label="Toggle theme"
      >
        <Sun className={`h-4 w-4 ${iconClass}`} />
      </button>
    )
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-9 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      <Sun className={`h-4 w-4 ${iconClass} rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 dark:opacity-0 absolute`} />
      <Moon className={`h-4 w-4 ${iconClass} rotate-90 scale-0 opacity-0 transition-all duration-500 dark:rotate-0 dark:scale-100 dark:opacity-100 absolute`} />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

