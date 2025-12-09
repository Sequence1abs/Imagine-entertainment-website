"use client"

import { useEffect, useState, useRef } from "react"

interface FlickeringGridProps {
  text: string
  fontSize?: number
  className?: string
  squareSize?: number
  gridGap?: number
  color?: string
  maxOpacity?: number
  flickerChance?: number
}

export function FlickeringGrid({
  text,
  fontSize = 90,
  className = "",
  squareSize = 2,
  gridGap = 3,
  color = "#6B7280",
  maxOpacity = 0.3,
  flickerChance = 0.1,
}: FlickeringGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [squares, setSquares] = useState<Array<{ id: number; opacity: number }>>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, cols: 0, rows: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        const cols = Math.floor(rect.width / (squareSize + gridGap))
        const rows = Math.floor(rect.height / (squareSize + gridGap))
        setDimensions({ width: rect.width, height: rect.height, cols, rows })
      }
    }

    // Initial update
    updateDimensions()

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [squareSize, gridGap])

  useEffect(() => {
    if (dimensions.cols === 0 || dimensions.rows === 0) return

    const totalSquares = dimensions.cols * dimensions.rows
    const newSquares = Array.from({ length: totalSquares }, (_, i) => ({
      id: i,
      opacity: Math.random() * maxOpacity,
    }))

    setSquares(newSquares)
  }, [dimensions.cols, dimensions.rows, maxOpacity])

  useEffect(() => {
    if (squares.length === 0) return

    const interval = setInterval(() => {
      setSquares((prev) =>
        prev.map((square) => ({
          ...square,
          opacity: Math.random() < flickerChance ? Math.random() * maxOpacity : square.opacity,
        }))
      )
    }, 150)

    return () => clearInterval(interval)
  }, [squares.length, flickerChance, maxOpacity])

  if (!mounted) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ width: "100%", height: "100%" }} suppressHydrationWarning>
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
            color: color,
            opacity: 0.08,
            letterSpacing: "0.05em",
          }}
        >
          {text}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={{ width: "100%", height: "100%" }} suppressHydrationWarning>
      {/* Grid squares */}
      {squares.length > 0 && dimensions.cols > 0 && (
        <div
          className="absolute inset-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${dimensions.cols}, ${squareSize}px)`,
            gap: `${gridGap}px`,
            alignContent: "start",
          }}
        >
          {squares.map((square) => (
            <div
              key={square.id}
              style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`,
                backgroundColor: color,
                opacity: square.opacity,
                transition: "opacity 0.15s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Text overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          fontSize: `${fontSize}px`,
          fontWeight: "bold",
          color: color,
          opacity: 0.08,
          letterSpacing: "0.05em",
        }}
      >
        {text}
      </div>
    </div>
  )
}

