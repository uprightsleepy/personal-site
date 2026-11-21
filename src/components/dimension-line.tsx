"use client"

import { useEffect, useRef, useState } from 'react'

// A dimension line that measures itself: the label is its own width in
// pixels, and it updates as the window is resized. Inside a <Reveal> it
// counts up to that width as the line is drawn out.
const COUNT_FOR = 900 // milliseconds

export default function DimensionLine({ className }: { className?: string }) {
  const line = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)
  // 0 to 1: how much of the width the label has counted up to.
  const [counted, setCounted] = useState(1)

  useEffect(() => {
    const el = line.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Count up when the reveal around this line goes.
  useEffect(() => {
    const reveal = line.current?.closest<HTMLElement>('[data-reveal]')
    if (!reveal) return
    let frame = 0
    const count = () => {
      const start = performance.now()
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / COUNT_FOR)
        setCounted(1 - Math.pow(1 - t, 3))
        if (t < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }
    if (reveal.dataset.reveal === 'go') return
    const watcher = new MutationObserver(() => {
      if (reveal.dataset.reveal !== 'go') return
      watcher.disconnect()
      count()
    })
    watcher.observe(reveal, { attributes: true, attributeFilter: ['data-reveal'] })
    return () => {
      watcher.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={line} className={`dim ${className ?? ''}`} aria-hidden="true">
      <i />
      <span className="dim-line" />
      {/* Empty until measured in the browser */}
      <span className="dim-label">
        {width === null ? '' : `${Math.round(width * counted).toLocaleString('en-US')} px`}
      </span>
      <span className="dim-line" />
      <i />
    </div>
  )
}
