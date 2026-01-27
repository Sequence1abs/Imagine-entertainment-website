"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useSystemStatus } from "@/hooks/use-system-status"

export function SystemStatusPill() {
  const { overallStatus } = useSystemStatus({ intervalMs: 60_000 })

  const statusConfig = {
    checking: {
      dot: "bg-muted-foreground",
      label: "Checking..."
    },
    online: {
      dot: "bg-green-500",
      label: "All Systems Go"
    },
    degraded: {
      dot: "bg-yellow-500",
      label: "Degraded"
    },
    offline: {
      dot: "bg-red-500",
      label: "Offline"
    }
  }

  const config = statusConfig[overallStatus]

  return (
    <Link 
      href="/dashboard/settings"
      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 px-3"
    >
      {overallStatus === "checking" ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <span className={`size-2 rounded-full ${config.dot} animate-pulse`} />
      )}
      <span className="hidden sm:inline">{config.label}</span>
    </Link>
  )
}
