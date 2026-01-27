"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { LoginForm } from "@/components/dashboard/login-form"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  isAuthenticated: boolean
  user?: { email: string; name?: string }
}

// Page transition variants
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 8,
  },
  enter: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    }
  },
  exit: { 
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.45, 0.45, 0.55, 0.95] as const,
    }
  }
}

// Login form animation variants
const loginVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.96,
  },
  enter: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    }
  }
}

export function DashboardLayoutClient({ children, isAuthenticated, user }: DashboardLayoutClientProps) {
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-muted flex flex-col items-center justify-center p-6 md:p-10">
        <motion.div 
          className="w-full max-w-sm md:max-w-4xl"
          initial="initial"
          animate="enter"
          variants={loginVariants}
        >
          <LoginForm />
        </motion.div>
      </div>
    )
  }

  // Prevent hydration mismatch by not rendering Radix UI components until mounted
  if (!mounted) {
    return (
      <div className="flex min-h-svh w-full bg-sidebar">
        <div className="w-[--sidebar-width] shrink-0" style={{ "--sidebar-width": "16rem" } as React.CSSProperties} />
        <div className="flex-1 p-2">
          <div className="flex h-[calc(100svh-1rem)] flex-col rounded-xl bg-background">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4" />
            <div className="flex-1 overflow-auto p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="p-2 overflow-hidden">
        <div className="flex h-[calc(100svh-1rem)] flex-col rounded-xl bg-background overflow-hidden">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto pl-4 pr-4 pb-4 pt-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={pathname}
                className="flex flex-col gap-4"
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
