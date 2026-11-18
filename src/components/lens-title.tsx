"use client"

import { useEffect, useRef } from 'react'

// Widths are percentages on Archivo's width axis, which runs from 62 to 125.
const FLOOR = 62 // letters far from the pointer tighten to the narrowest width
const PEAK = 125 // the letter directly under the pointer opens to the widest
const SPREAD = 0.07 // how far the bulge reaches, as a share of the title's width

// A display title whose letters widen under the pointer, like type seen
// through a lens moving along the line. It uses the width axis of the one
// typeface. The effect belongs to the whole index row (.work-row), and is
// skipped on touch screens and for people who ask for reduced motion.
// The letters are hidden from screen readers; the caller supplies the text.
export default function LensTitle({
  text,
  redactFirstWord = false,
}: {
  text: string
  redactFirstWord?: boolean
}) {
  const title = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = title.current
    const row = el?.closest<HTMLElement>('.work-row')
    if (!el || !row) return
    if (!window.matchMedia('(hover: hover)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const letters = Array.from(el.querySelectorAll<HTMLElement>('.lens-letter'))
    // Letter positions are read once, at rest, when the pointer arrives.
    // Reading them while the letters move would make the bulge chase itself.
    let centers: number[] = []
    let width = 0
    let frame = 0

    const enter = () => {
      width = el.getBoundingClientRect().width
      centers = letters.map((letter) => {
        const box = letter.getBoundingClientRect()
        return box.left + box.width / 2
      })
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      if (!centers.length) enter()
      const x = event.clientX
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        letters.forEach((letter, index) => {
          const distance = (x - centers[index]) / width
          const lift = Math.exp(-(distance * distance) / (2 * SPREAD * SPREAD))
          letter.style.fontStretch = `${(FLOOR + (PEAK - FLOOR) * lift).toFixed(1)}%`
        })
      })
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      centers = []
      letters.forEach((letter) => letter.style.removeProperty('font-stretch'))
    }

    row.addEventListener('pointerenter', enter)
    row.addEventListener('pointermove', move)
    row.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      row.removeEventListener('pointerenter', enter)
      row.removeEventListener('pointermove', move)
      row.removeEventListener('pointerleave', leave)
    }
  }, [])

  const words = text.split(' ')

  return (
    <span ref={title} className="lens" aria-hidden="true">
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {/* The first word of the secrets migration loads redacted (see .redact) */}
          <span className={index === 0 && redactFirstWord ? 'lens-word redact' : 'lens-word'}>
            {Array.from(word).map((letter, position) => (
              <span key={position} className="lens-letter">
                {letter}
              </span>
            ))}
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
