"use client"

import { useEffect, useRef, useState, type ReactNode } from 'react'

// A revision cloud: the scalloped outline drafters draw around whatever
// changed since the last issue of a drawing. The outline is an SVG path of
// arcs fitted to the box, redrawn when the box changes size.
const CHORD = 30 // target length of one scallop, in pixels

function cloudPath(width: number, height: number): string {
  const side = (length: number, dx: number, dy: number) => {
    const count = Math.max(2, Math.round(length / CHORD))
    const step = length / count
    const radius = (step * 0.62).toFixed(2)
    return Array.from(
      { length: count },
      () => `a${radius} ${radius} 0 0 1 ${(dx * step).toFixed(2)} ${(dy * step).toFixed(2)}`,
    ).join('')
  }
  // Clockwise from the top left, so every arc bulges outward.
  return `M0 0${side(width, 1, 0)}${side(height, 0, 1)}${side(width, -1, 0)}${side(height, 0, -1)}Z`
}

export default function RevisionCloud({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const box = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setSize({ width: el.offsetWidth, height: el.offsetHeight })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`rev-cloud ${className ?? ''}`}>
      {/* The outline sits outside the content, so the text keeps its alignment */}
      <div ref={box} className="rev-cloud-outline" aria-hidden="true">
        {size && (
          <svg width={size.width} height={size.height} focusable="false">
            <path d={cloudPath(size.width, size.height)} />
          </svg>
        )}
      </div>
      {children}
    </div>
  )
}
