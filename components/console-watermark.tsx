"use client"

import { useEffect } from "react"

/**
 * Console signature for imaginesl.com — whole signature highlighted on mount.
 */
export function ConsoleWatermark() {
  useEffect(() => {
    const signature = [
      "╔══════════════════════════════════════════════════════════════╗",
      "║     IMAGINE ENTERTAINMENT (PVT) LTD                          ║",
      "║     https://www.imaginesl.com                               ║",
      "║                                                              ║",
      "║     Developed by Sequence Labs                              ║",
      "║     © 2026 All Rights Reserved                              ║",
      "╚══════════════════════════════════════════════════════════════╝",
    ].join("\n")

    const style = [
      "background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);",
      "color: #f4921f;",
      "font-size: 14px;",
      "font-weight: 700;",
      "letter-spacing: 0.04em;",
      "line-height: 1.6;",
      "padding: 16px 20px;",
      "border: 2px solid #f4921f;",
      "border-radius: 8px;",
      "text-shadow: 0 0 20px rgba(244, 146, 31, 0.3);",
    ].join(" ")

    console.log("%c%s", style, signature)
  }, [])

  return null
}
