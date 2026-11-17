"use client"

import { useEffect, useRef, useState } from 'react'

// A dimension line that measures itself: the label is its own width in
// pixels, and it updates as the window is resized.
export default function DimensionLine({ className }: { className?: string }) {
  const line = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const el = line.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={line} className={`dim ${className ?? ''}`} aria-hidden="true">
      <i />
      <span className="dim-line" />
      {/* Empty until measured in the browser */}
      <span className="dim-label">{width === null ? '' : `${width.toLocaleString('en-US')} px`}</span>
      <span className="dim-line" />
      <i />
    </div>
  )
}
