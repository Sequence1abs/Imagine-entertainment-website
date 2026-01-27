"use client"

import { Database, Cloud, Server, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useSystemStatus, type ServiceStatusState } from "@/hooks/use-system-status"

const ICON_BY_NAME = { Database, "Image Storage": Cloud, "API Server": Server } as const

export function SystemStatus() {
  const { services } = useSystemStatus({ intervalMs: 30_000 })

  const getStatusColor = (status: ServiceStatusState) => {
    switch (status) {
      case "online": return "text-green-500"
      case "offline": return "text-red-500"
      case "degraded": return "text-yellow-500"
      default: return "text-muted-foreground"
    }
  }

  const getStatusBg = (status: ServiceStatusState) => {
    switch (status) {
      case "online": return "bg-green-500/10"
      case "offline": return "bg-red-500/10"
      case "degraded": return "bg-yellow-500/10"
      default: return "bg-muted/50"
    }
  }

  const getStatusIcon = (status: ServiceStatusState) => {
    switch (status) {
      case "online": return <CheckCircle2 className="size-4 text-green-500" />
      case "offline": return <XCircle className="size-4 text-red-500" />
      case "degraded": return <CheckCircle2 className="size-4 text-yellow-500" />
      default: return <Loader2 className="size-4 animate-spin text-muted-foreground" />
    }
  }

  const allOnline = services.every((s) => s.status === "online")
  const anyOffline = services.some((s) => s.status === "offline")
  const anyChecking = services.some((s) => s.status === "checking")
  const anyDegraded = services.some((s) => s.status === "degraded")

  const bannerLabel = allOnline
    ? "All Systems Operational"
    : anyChecking
      ? "Checking..."
      : anyOffline
        ? "Service Disruption"
        : anyDegraded
          ? "Partially Degraded"
          : "Checking..."

  const bannerStyle = allOnline
    ? "bg-green-500/10 text-green-500"
    : anyOffline
      ? "bg-red-500/10 text-red-500"
      : anyChecking || anyDegraded
        ? "bg-yellow-500/10 text-yellow-500"
        : "bg-muted/50 text-muted-foreground"

  const bannerDot = allOnline
    ? "bg-green-500"
    : anyOffline
      ? "bg-red-500"
      : "bg-yellow-500"

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-semibold">System Status</h2>
          <p className="text-sm text-muted-foreground">Live health check of connected services</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${bannerStyle}`}>
          <span className={`size-2 rounded-full ${bannerDot} animate-pulse`} />
          {bannerLabel}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => {
          const Icon = ICON_BY_NAME[service.name as keyof typeof ICON_BY_NAME] ?? Database
          return (
          <div 
            key={service.name}
            className={`flex items-center gap-4 p-4 rounded-lg border border-border ${getStatusBg(service.status)}`}
          >
            <div className={`p-3 rounded-lg ${getStatusBg(service.status)}`}>
              <Icon className={`size-5 ${getStatusColor(service.status)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium">{service.name}</p>
                {getStatusIcon(service.status)}
              </div>
              <p className="text-xs text-muted-foreground truncate">{service.description}</p>
              {service.latency && service.status === "online" && (
                <p className="text-xs text-green-500 mt-0.5">{service.latency}ms response</p>
              )}
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
