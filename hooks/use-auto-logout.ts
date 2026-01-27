"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const INACTIVITY_LIMIT = 20 * 60 * 1000 // 20 minutes in milliseconds
const CHECK_INTERVAL = 1000 // Check every second

export function useAutoLogout() {
  const router = useRouter()
  const lastActivityRef = useRef<number>(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    const updateActivity = () => {
      lastActivityRef.current = Date.now()
    }

    const checkInactivity = async () => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current

      if (timeSinceLastActivity >= INACTIVITY_LIMIT) {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          await supabase.auth.signOut()
          toast.info("Session expired due to inactivity", {
            description: "You have been logged out for security."
          })
          router.push("/dashboard?error=session_expired")
        }
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
