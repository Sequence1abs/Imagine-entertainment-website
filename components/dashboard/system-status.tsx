"use client"

import { useEffect, useState } from "react"
import { Database, Cloud, Server, CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface ServiceStatus {
  name: string
  status: "checking" | "online" | "offline" | "degraded"
  latency?: number
  icon: typeof Database
  description: string
}

export function SystemStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Database",
      status: "checking",
      icon: Database,
      description: "Supabase PostgreSQL"
    },
    {
      name: "Image Storage",
      status: "checking",
      icon: Cloud,
      description: "Cloudinary CDN"
    },
    {
      name: "API Server",
      status: "checking",
      icon: Server,
      description: "Next.js Backend"
    },
  ])

  useEffect(() => {
    const checkServices = async () => {
      // Check Database (Supabase)
      const dbStart = performance.now()
      try {
        const res = await fetch('/api/keep-alive', { method: 'GET' })
        const dbLatency = Math.round(performance.now() - dbStart)
        setServices(prev => prev.map(s => 
          s.name === "Database" 
            ? { ...s, status: res.ok ? "online" : "offline", latency: dbLatency }
            : s
        ))
      } catch {
        setServices(prev => prev.map(s => 
          s.name === "Database" ? { ...s, status: "offline" } : s
        ))
      }

      // Check Cloudinary (via env check - if configured, assume online)
      const cloudinaryConfigured = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      setServices(prev => prev.map(s => 
        s.name === "Image Storage" 
          ? { ...s, status: cloudinaryConfigured ? "online" : "offline" }
          : s
      ))

      // Check API Server (self-check)
      const apiStart = performance.now()
      try {
        const res = await fetch('/api/events', { method: 'GET' })
        const apiLatency = Math.round(performance.now() - apiStart)
        setServices(prev => prev.map(s => 
          s.name === "API Server" 
            ? { ...s, status: res.ok ? "online" : "degraded", latency: apiLatency }
            : s
        ))
      } catch {
        setServices(prev => prev.map(s => 
          s.name === "API Server" ? { ...s, status: "offline" } : s
        ))
      }
    }

    checkServices()
    
    // Refresh every 30 seconds
    const interval = setInterval(checkServices, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online": return "text-green-500"
      case "offline": return "text-red-500"
      case "degraded": return "text-yellow-500"
      default: return "text-muted-foreground"
    }
  }

  const getStatusBg = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online": return "bg-green-500/10"
      case "offline": return "bg-red-500/10"
      case "degraded": return "bg-yellow-500/10"
      default: return "bg-muted/50"
    }
  }

  const getStatusIcon = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "online": return <CheckCircle2 className="size-4 text-green-500" />
      case "offline": return <XCircle className="size-4 text-red-500" />
      case "degraded": return <CheckCircle2 className="size-4 text-yellow-500" />
      default: return <Loader2 className="size-4 animate-spin text-muted-foreground" />
    }
  }

  const allOnline = services.every(s => s.status === "online")
  const anyOffline = services.some(s => s.status === "offline")

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-semibold">System Status</h2>
          <p className="text-sm text-muted-foreground">Live health check of connected services</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium w-fit ${
          allOnline ? "bg-green-500/10 text-green-500" : 
          anyOffline ? "bg-red-500/10 text-red-500" : 
          "bg-yellow-500/10 text-yellow-500"
        }`}>
          <span className={`size-2 rounded-full ${
            allOnline ? "bg-green-500" : anyOffline ? "bg-red-500" : "bg-yellow-500"
          } animate-pulse`} />
          {allOnline ? "All Systems Operational" : anyOffline ? "Service Disruption" : "Checking..."}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <div 
            key={service.name}
            className={`flex items-center gap-4 p-4 rounded-lg border border-border ${getStatusBg(service.status)}`}
          >
            <div className={`p-3 rounded-lg ${getStatusBg(service.status)}`}>
              <service.icon className={`size-5 ${getStatusColor(service.status)}`} />
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
        ))}
      </div>
    </div>
  )
}
