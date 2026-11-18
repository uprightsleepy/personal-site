"use client"

import { useEffect, useRef } from 'react'

export type PosterLine = {
  text: string
  // Width of the typeface for this line, as a percentage (Archivo runs 62 to 125).
  stretch: number
  // Width of the line in ems at that setting. Each line's type size is the
  // measure divided by this, so every line fills the measure exactly. The
  // value here is the starting point; the browser re-measures once the font
  // has loaded, so a change of wording still fits.
  ems: number
  outline?: boolean
}

// A statement set the way a wood type poster is: every line runs the full
// measure, in a different width of the one typeface, so short lines come out
// tall and long lines come out small.
export default function Poster({ label, lines }: { label: string; lines: PosterLine[] }) {
  const poster = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = poster.current
    if (!el) return
    let cancelled = false
    const fit = () => {
      if (cancelled) return
      el.querySelectorAll<HTMLElement>('.poster-line').forEach((line) => {
        const size = parseFloat(getComputedStyle(line).fontSize)
        if (!size) return
        line.style.setProperty('--ems', (line.offsetWidth / size).toFixed(4))
      })
    }
    document.fonts.ready.then(fit)
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <span className="sr-only">{label}</span>
      <span ref={poster} className="poster" aria-hidden="true">
        {lines.map((line) => (
          <span
            key={line.text}
            className={line.outline ? 'poster-line poster-outline' : 'poster-line'}
            style={
              { '--ems': line.ems, '--stretch': `${line.stretch}%` } as React.CSSProperties
            }
          >
            {line.text}
          </span>
        ))}
      </span>
    </>
  )
}
