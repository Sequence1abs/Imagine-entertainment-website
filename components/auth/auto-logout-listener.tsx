"use client"

import { useAutoLogout } from "@/hooks/use-auto-logout"

export function AutoLogoutListener() {
  useAutoLogout()
  return null
}
