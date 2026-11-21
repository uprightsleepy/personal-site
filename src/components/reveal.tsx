"use client"

import { useEffect, useRef } from 'react'

// Marks its contents as seen the first time they scroll into view. The
// stylesheet hangs a one-off entrance on that (see the footer's reveal in
// globals.css). Until this has run in the browser nothing is marked, so
// without scripts, or for anyone who asks for reduced motion, the contents
// are simply there.
//
//   data-reveal="off"   as served: nothing is held back
//   data-reveal="wait"  not seen yet: the stylesheet may hold things back
//   data-reveal="go"    seen: the entrance plays, once
export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.dataset.reveal = 'wait'
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        el.dataset.reveal = 'go'
        observer.disconnect()
      },
      // Wait until a good strip of it is on screen, not the first pixel.
      { rootMargin: '0px 0px -18% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={box} className={className} data-reveal="off">
      {children}
    </div>
  )
}
