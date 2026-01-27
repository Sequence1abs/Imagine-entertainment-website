"use client"

import { useEffect } from "react"

/**
 * Console signature for imaginesl.com — logged on mount with styled “Developed by Sequence Labs”.
 */
export function ConsoleWatermark() {
  useEffect(() => {
    const line1 = "Imagine Entertainment (Pvt) Ltd"
    const line2 = "https://www.imaginesl.com"
    const line3 = "Developed by"
    const line4 = "Sequence Labs"
    const line5 = "© 2026 All Rights Reserved"

    const base = "color: #94a3b8; font-size: 11px;"
    const highlight =
      "color: #38bdf8; font-size: 13px; font-weight: 700; letter-spacing: 0.02em;"

    console.log(
      `\n%c${line1}\n%c${line2}\n\n%c${line3}\n%c${line4}\n\n%c${line5}\n`,
      base,
      base,
      base,
      highlight,
      base
    )
  }, [])

  return null
}
