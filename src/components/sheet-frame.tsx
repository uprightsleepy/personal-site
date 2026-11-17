"use client"

import { useEffect, useRef } from 'react'

const columns = ['1', '2', '3', '4', '5', '6', '7', '8']
const rows = ['A', 'B', 'C', 'D', 'E']

// The border of a drawing sheet, with zone references: numbers across and
// letters down, so a spot on the sheet can be called out as "C4". It is
// decoration, shown on wide screens only (see .frame in globals.css), and the
// zone under the mouse pointer is marked on all four sides.
export default function SheetFrame() {
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = frame.current
    if (!el) return
    let current = ''

    const mark = (col: number, row: number) => {
      const next = col < 0 ? '' : `${col}:${row}`
      if (next === current) return
      current = next
      el.querySelectorAll('[data-on]').forEach((cell) => cell.removeAttribute('data-on'))
      if (col < 0) return
      el.querySelectorAll(`[data-col="${col}"], [data-row="${row}"]`).forEach((cell) =>
        cell.setAttribute('data-on', ''),
      )
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const band = el.querySelector<HTMLElement>('.frame-top')?.offsetHeight ?? 0
      // The frame is hidden on narrow screens, where the band measures zero.
      if (!band) return
      const { width, height } = el.getBoundingClientRect()
      const x = (event.clientX - band) / (width - band * 2)
      const y = (event.clientY - band) / (height - band * 2)
      const clamp = (value: number, count: number) =>
        Math.min(count - 1, Math.max(0, Math.floor(value * count)))
      mark(clamp(x, columns.length), clamp(y, rows.length))
    }
    const clear = () => mark(-1, -1)

    document.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', clear)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', clear)
    }
  }, [])

  return (
    <div ref={frame} className="frame" aria-hidden="true">
      {(['top', 'bottom'] as const).map((side) => (
        <div key={side} className={`frame-strip frame-${side}`}>
          {columns.map((label, index) => (
            <span key={label} data-col={index}>
              {label}
            </span>
          ))}
        </div>
      ))}
      {(['left', 'right'] as const).map((side) => (
        <div key={side} className={`frame-strip frame-${side}`}>
          {rows.map((label, index) => (
            <span key={label} data-row={index}>
              {label}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
