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
// Each letter also carries its place in the title, and the title its place
// in the list (`row`), which the stylesheet uses to give every letter its
// own chips of missing ink (see .lens-letter in globals.css). Where the
// letters can move, each one's width at rest is measured, so its chips can
// be stretched with it and stay on the same parts of the letter.
export default function LensTitle({
  text,
  row = 0,
  redactFirstWord = false,
}: {
  text: string
  row?: number
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

    // Each letter's width at rest, for its chips (see .lens[data-fit]). Taken
    // once the typeface has loaded and again whenever the title changes size,
    // but never while the pointer is on it and the letters are out of shape.
    const fit = () => {
      if (centers.length) return
      letters.forEach((letter) => {
        letter.style.setProperty('--w0', letter.getBoundingClientRect().width.toFixed(2))
      })
      el.dataset.fit = ''
    }
    void document.fonts.ready.then(fit)
    const sizes = new ResizeObserver(fit)
    sizes.observe(el)

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
      sizes.disconnect()
      row.removeEventListener('pointerenter', enter)
      row.removeEventListener('pointermove', move)
      row.removeEventListener('pointerleave', leave)
    }
  }, [])

  const words = text.split(' ')
  // Where each word's first letter falls in the whole title.
  const starts = words.map((_, index) => words.slice(0, index).join('').length)

  return (
    <span ref={title} className="lens" aria-hidden="true" style={{ '--row': row } as React.CSSProperties}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {/* The first word of the secrets migration loads redacted (see .redact) */}
          <span className={index === 0 && redactFirstWord ? 'lens-word redact' : 'lens-word'}>
            {Array.from(word).map((letter, position) => (
              <span
                key={position}
                className="lens-letter"
                style={
                  {
                    '--chip': starts[index] + position,
                    '--across': `${((starts[index] + position) * 37 + row * 61) % 100}%`,
                  } as React.CSSProperties
                }
              >
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
