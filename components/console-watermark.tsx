"use client"

import { useEffect } from "react"

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ║                                                                         ║
 * ║        Property of IMAGINE ENTERTAINMENT (PVT) LTD.                    ║
 * ║        Website: https://www.imaginesl.com                              ║
 * ║                                                                         ║
 * ║        Developed by Skynet Labs                                        ║
 * ║        https://www.linkedin.com/in/tharukakarunanayaka/                ║
 * ║        https://www.linkedin.com/in/hasal/                              ║
 * ║                                                                         ║
 * ║        © 2026 All Rights Reserved                                      ║
 * ║                                                                         ║
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function ConsoleWatermark() {
  useEffect(() => {
    const asciiArt = `
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ║                                                                         ║
 * ║        Property of IMAGINE ENTERTAINMENT (PVT) LTD.                     ║
 * ║        Website: https://www.imaginesl.com                               ║
 * ║                                                                         ║
 * ║        Developed by Skynet Labs                                         ║
 * ║        https://www.linkedin.com/in/tharukakarunanayaka/                 ║
 * ║        https://www.linkedin.com/in/hasal/                               ║
 * ║                                                                         ║
 * ║        © 2026 All Rights Reserved                                       ║
 * ║                                                                         ║
 * ═══════════════════════════════════════════════════════════════════════════
 */
`
    console.log(asciiArt)
  }, [])

  return null
}
