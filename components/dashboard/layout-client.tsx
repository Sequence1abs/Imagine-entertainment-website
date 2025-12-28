"use client"

import * as React from "react"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import { LoginForm } from "@/components/dashboard/login-form"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface DashboardLayoutClientProps {
  children: React.ReactNode
  isAuthenticated: boolean
  user?: { email: string; name?: string }
}

export function DashboardLayoutClient({ children, isAuthenticated, user }: DashboardLayoutClientProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-background">
        <LoginForm />
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
      <SidebarInset className="p-2">
        <div className="flex h-[calc(100svh-1rem)] flex-col rounded-xl bg-background">
          <SiteHeader />
          <div className="flex-1 overflow-auto px-4 pb-4 pt-6">
            <div className="flex flex-col gap-4">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
