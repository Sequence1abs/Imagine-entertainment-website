"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { LoginForm } from "@/components/dashboard/login-form"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useUploadQueue } from "@/context/upload-queue"
import { Loader2 } from "lucide-react"

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
  const uploadQueue = useUploadQueue()
  const pendingCount = uploadQueue?.jobs.filter((j) => j.status === 'pending' || j.status === 'uploading_cover' || j.status === 'uploading_gallery').length ?? 0

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

  // Prevent hydration mismatch: render a fixed skeleton until mounted.
  // Rendering {children} here can cause server/client DOM mismatch (e.g. streaming, different order).
  if (!mounted) {
    return (
      <div className="flex min-h-svh w-full bg-sidebar" suppressHydrationWarning>
        <div className="w-[--sidebar-width] shrink-0" style={{ "--sidebar-width": "16rem" } as React.CSSProperties} />
        <div className="flex-1 p-2">
          <div className="flex h-[calc(100svh-1rem)] flex-col rounded-xl bg-background">
            <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4" />
            <div className="flex-1 overflow-auto p-4">
              <div className="flex flex-col gap-4">
                <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" aria-hidden />
                <div className="h-64 bg-muted/50 rounded animate-pulse" aria-hidden />
              </div>
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
          {pendingCount > 0 && (
            <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm border-b border-border">
              <Loader2 className="size-4 animate-spin" />
              <span>{pendingCount} event{pendingCount !== 1 ? 's' : ''} uploading in background</span>
            </div>
          )}
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
