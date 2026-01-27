"use client"

import { useCallback, useEffect, useState } from "react"

export type ServiceStatusState = "checking" | "online" | "offline" | "degraded"

export interface ServiceStatusItem {
  name: string
  status: ServiceStatusState
  latency?: number
  description: string
}

export type OverallStatus = "checking" | "online" | "offline" | "degraded"

const INITIAL_SERVICES: Omit<ServiceStatusItem, "latency">[] = [
  { name: "Database", status: "checking", description: "Supabase PostgreSQL" },
  { name: "Image Storage", status: "checking", description: "Cloudflare Images" },
  { name: "API Server", status: "checking", description: "Next.js Backend" },
]

async function checkAllServices(): Promise<ServiceStatusItem[]> {
  const results: ServiceStatusItem[] = INITIAL_SERVICES.map((s) => ({
    ...s,
    status: "checking" as ServiceStatusState,
    latency: undefined,
  }))

  // Check Database (Supabase)
  const dbStart = performance.now()
  try {
    const res = await fetch("/api/keep-alive", { method: "GET" })
    const dbLatency = Math.round(performance.now() - dbStart)
    const idx = results.findIndex((s) => s.name === "Database")
    if (idx >= 0) {
      results[idx] = {
        ...results[idx],
        status: res.ok ? "online" : "offline",
        latency: dbLatency,
      }
    }
  } catch {
    const idx = results.findIndex((s) => s.name === "Database")
    if (idx >= 0) results[idx] = { ...results[idx], status: "offline" }
  }

  // Check Image Storage (Cloudflare Images)
  const imageStart = performance.now()
  try {
    const res = await fetch("/api/health/cloudflare-images", { method: "GET" })
    const imageLatency = Math.round(performance.now() - imageStart)
    const idx = results.findIndex((s) => s.name === "Image Storage")
    if (idx >= 0) {
      results[idx] = {
        ...results[idx],
        status: res.ok ? "online" : "offline",
        latency: imageLatency,
      }
    }
  } catch {
    const idx = results.findIndex((s) => s.name === "Image Storage")
    if (idx >= 0) results[idx] = { ...results[idx], status: "offline" }
  }

  // Check API Server (self-check)
  const apiStart = performance.now()
  try {
    const res = await fetch("/api/events", { method: "GET" })
    const apiLatency = Math.round(performance.now() - apiStart)
    const idx = results.findIndex((s) => s.name === "API Server")
    if (idx >= 0) {
      results[idx] = {
        ...results[idx],
        status: res.ok ? "online" : "degraded",
        latency: apiLatency,
      }
    }
  } catch {
    const idx = results.findIndex((s) => s.name === "API Server")
    if (idx >= 0) results[idx] = { ...results[idx], status: "offline" }
  }

  return results
}

function deriveOverallStatus(services: ServiceStatusItem[]): OverallStatus {
  const anyChecking = services.some((s) => s.status === "checking")
  if (anyChecking) return "checking"
  const anyOffline = services.some((s) => s.status === "offline")
  if (anyOffline) return "offline"
  const anyDegraded = services.some((s) => s.status === "degraded")
  if (anyDegraded) return "degraded"
  return "online"
}

export function useSystemStatus(options?: { intervalMs?: number }) {
  const intervalMs = options?.intervalMs ?? 30_000
  const [services, setServices] = useState<ServiceStatusItem[]>(() =>
    INITIAL_SERVICES.map((s) => ({ ...s, status: "checking" as ServiceStatusState }))
  )
  const [overallStatus, setOverallStatus] = useState<OverallStatus>("checking")

  const runChecks = useCallback(async () => {
    const next = await checkAllServices()
    setServices(next)
    setOverallStatus(deriveOverallStatus(next))
  }, [])

  useEffect(() => {
    runChecks()
    const interval = setInterval(runChecks, intervalMs)
    return () => clearInterval(interval)
  }, [runChecks, intervalMs])

  return { services, overallStatus, refetch: runChecks }
}
