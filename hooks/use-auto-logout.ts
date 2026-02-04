"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Session } from "@supabase/supabase-js"

const INACTIVITY_LIMIT = 20 * 60 * 1000 // 20 minutes in milliseconds
const MAX_SESSION_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours – close tab and come back next day = must re-login
const CHECK_INTERVAL = 1000 // Check every second

/** Get JWT "issued at" time (seconds) from access_token, or null if invalid */
function getSessionIssuedAt(session: Session): number | null {
  try {
    const payload = session.access_token.split(".")[1]
    if (!payload) return null
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { iat?: number }
    return typeof decoded.iat === "number" ? decoded.iat : null
  } catch {
    return null
  }
}

export function useAutoLogout() {
  const router = useRouter()
  const lastActivityRef = useRef<number>(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const updateActivity = () => {
      lastActivityRef.current = Date.now()
    }

    const doSignOut = async (reason: "inactivity" | "max_age") => {
      await supabase.auth.signOut()
      if (reason === "inactivity") {
        toast.info("Session expired due to inactivity", {
          description: "You have been logged out for security.",
        })
      } else {
        toast.info("Session expired", {
          description: "Please sign in again for security.",
        })
      }
      router.push("/dashboard?error=session_expired")
    }

    const checkInactivity = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const now = Date.now()
      const nowSec = Math.floor(now / 1000)

      // 1) Max session age: session older than 24h → sign out (e.g. closed tab yesterday, open today)
      const iat = getSessionIssuedAt(session)
      if (iat != null && nowSec - iat >= MAX_SESSION_AGE_MS / 1000) {
        await doSignOut("max_age")
        return
      }

      // 2) Inactivity: no user activity for 20 min while tab is open → sign out
      const timeSinceLastActivity = now - lastActivityRef.current
      if (timeSinceLastActivity >= INACTIVITY_LIMIT) {
        await doSignOut("inactivity")
      }
    }

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click"
    ]

    events.forEach(event => {
      document.addEventListener(event, updateActivity)
    })

    // Run once on mount (e.g. user opens dashboard next day → sign out immediately if session > 24h)
    checkInactivity()
    timerRef.current = setInterval(checkInactivity, CHECK_INTERVAL)

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity)
      })
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [router])
}
