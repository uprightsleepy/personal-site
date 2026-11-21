"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './torn-corner.module.css'

// An easter egg for the home page. The bottom right corner of the sheet is
// torn a little. Drag the corner up and to the left and the sheet rips open
// on a music video.
//
// The video is a YouTube embed from the no-cookie domain. Nothing is
// requested from YouTube until the sheet is torn, and public/_headers allows
// that one domain to be framed.
const VIDEO = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'

const REST = 30 // legs of the torn corner at rest, in pixels
const PEEK = 44 // on hover
const RIP_AT = 0.5 // share of the box height the corner must be pulled to rip
const RIP_MS = 620

type State = 'idle' | 'dragging' | 'ripping' | 'open'
type Point = [number, number]

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const mix = (from: Point, to: Point, amount: number): Point => [
  lerp(from[0], to[0], amount),
  lerp(from[1], to[1], amount),
]

// A cheap repeatable "random" number for index i, so the ragged edge keeps
// its shape from frame to frame.
const noise = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// A ragged line from one point to another: short steps, each nudged
// sideways, the way paper tears.
function ragged(from: Point, to: Point, seed: number): string {
  const length = Math.hypot(to[0] - from[0], to[1] - from[1])
  const steps = Math.max(1, Math.round(length / 11))
  const nx = -(to[1] - from[1]) / (length || 1)
  const ny = (to[0] - from[0]) / (length || 1)
  let path = ''
  for (let i = 1; i <= steps; i++) {
    const [x, y] = mix(from, to, i / steps)
    const nudge = i === steps ? 0 : noise(seed + i) * 3.2
    path += `L${(x + nx * nudge).toFixed(1)} ${(y + ny * nudge).toFixed(1)}`
  }
  return path
}

export default function TornCorner() {
  const box = useRef<HTMLDivElement>(null)
  const hole = useRef<HTMLDivElement>(null)
  const edge = useRef<SVGPathElement>(null)
  const flap = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<State>('idle')
  const current = useRef<State>('idle')
  // `pull` is how far the corner is pulled back; `rip` runs 0 to 1 as the
  // tear spreads from the corner to the whole box.
  const shape = useRef({ pull: REST, rip: 0 })
  const tween = useRef(0)

  const move = useCallback((next: State) => {
    current.current = next
    setState(next)
  }, [])

  // Draw the hole, its ragged edge and the folded-back corner for the
  // current shape. This writes straight to the DOM so dragging stays smooth.
  const draw = useCallback(() => {
    const el = box.current
    if (!el || !hole.current || !edge.current || !flap.current) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const { pull, rip } = shape.current
    const a = Math.min(pull, h - 4)
    // The tear runs from the bottom edge, through a point, to the right
    // edge. At rest that is a straight diagonal across the corner; as it
    // rips, the three points travel to the far corners of the box.
    const bottom = mix([w - a, h], [0, h], rip)
    const middle = mix([w - a / 2, h - a / 2], [0, 0], rip)
    const right = mix([w, h - a], [w, 0], rip)
    const px = (point: Point) => `${point[0].toFixed(1)}px ${point[1].toFixed(1)}px`

    hole.current.style.clipPath = `polygon(${w}px ${h}px, ${px(bottom)}, ${px(middle)}, ${px(right)})`
    edge.current.setAttribute(
      'd',
      `M${bottom[0].toFixed(1)} ${bottom[1].toFixed(1)}${ragged(bottom, middle, 3)}${ragged(middle, right, 71)}`,
    )
    // The corner of the sheet, folded back over the tear line.
    flap.current.style.clipPath = `polygon(${px([w - a, h])}, ${px([w, h - a])}, ${px([w - a, h - a])})`
  }, [])

  // Ease `pull` and `rip` toward new values, then run `done`.
  const animate = useCallback(
    (to: { pull?: number; rip?: number }, ms: number, done?: () => void) => {
      cancelAnimationFrame(tween.current)
      const from = { ...shape.current }
      const target = { ...from, ...to }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const start = performance.now()
      const frame = (now: number) => {
        const t = reduced ? 1 : Math.min(1, (now - start) / ms)
        // Ease in and out, with a little stutter so a rip comes in jerks.
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        const jerk = to.rip !== undefined && t < 1 ? Math.sin(t * 34) * 0.012 : 0
        shape.current = {
          pull: lerp(from.pull, target.pull, eased),
          rip: Math.max(0, Math.min(1, lerp(from.rip, target.rip, eased) + jerk)),
        }
        draw()
        if (t < 1) tween.current = requestAnimationFrame(frame)
        else done?.()
      }
      tween.current = requestAnimationFrame(frame)
    },
    [draw],
  )

  const rip = useCallback(() => {
    if (current.current === 'ripping' || current.current === 'open') return
    move('ripping')
    animate({ rip: 1 }, RIP_MS, () => move('open'))
  }, [animate, move])

  const close = useCallback(() => {
    move('idle')
    animate({ pull: REST, rip: 0 }, 380)
  }, [animate, move])

  // Dragging the corner.
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null)

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (current.current !== 'idle') return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX, y: event.clientY, moved: false }
    move('dragging')
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const origin = drag.current
    if (!origin || current.current !== 'dragging' || !box.current) return
    const pulled = Math.max(origin.x - event.clientX, origin.y - event.clientY, 0)
    if (pulled > 4) origin.moved = true
    cancelAnimationFrame(tween.current)
    shape.current = { pull: REST + pulled, rip: 0 }
    draw()
    if (REST + pulled >= box.current.offsetHeight * RIP_AT) {
      drag.current = null
      rip()
    }
  }

  const onPointerUp = () => {
    const origin = drag.current
    drag.current = null
    if (current.current !== 'dragging') return
    move('idle')
    if (origin && !origin.moved) {
      // A plain click gives the corner a tug, as a hint that it pulls.
      animate({ pull: 78 }, 160, () => animate({ pull: REST }, 260))
    } else {
      animate({ pull: REST }, 260)
    }
  }

  // The pointer drags; the keyboard rips in one go.
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      rip()
    }
  }

  useEffect(() => {
    draw()
    window.addEventListener('resize', draw)
    return () => {
      window.removeEventListener('resize', draw)
      cancelAnimationFrame(tween.current)
    }
  }, [draw])

  useEffect(() => {
    if (state !== 'open') return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, close])

  const playing = state === 'ripping' || state === 'open'

  return (
    <div ref={box} className={styles.tear} data-state={state}>
      {/* What is behind the sheet */}
      <div ref={hole} className={styles.hole}>
        {playing && (
          <iframe
            src={VIDEO}
            title="Rick Astley, Never Gonna Give You Up (music video)"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          />
        )}
      </div>

      {/* The ragged edge of the tear */}
      <svg className={styles.edge} aria-hidden="true" focusable="false">
        <defs>
          <filter id="torn-edge" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="5" result="tooth" />
            <feDisplacementMap in="SourceGraphic" in2="tooth" scale="5" />
          </filter>
        </defs>
        <path ref={edge} />
      </svg>

      {/* The corner of the sheet, folded back */}
      <div className={styles.flapShadow} aria-hidden="true">
        <div ref={flap} className={styles.flap} />
      </div>

      {!playing && (
        <button
          type="button"
          className={styles.grab}
          aria-label="A torn corner of the drawing. Pull it."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => {
            if (current.current === 'idle') animate({ pull: PEEK }, 180)
          }}
          onPointerLeave={() => {
            if (current.current === 'idle') animate({ pull: REST }, 220)
          }}
          onKeyDown={onKeyDown}
        />
      )}

      {state === 'open' && (
        <button type="button" className={styles.close} onClick={close}>
          Tape it back
        </button>
      )}
    </div>
  )
}
