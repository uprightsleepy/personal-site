"use client"

import { useRef, useState } from 'react'

// A white rabbit, in pixels, that lives behind the first line of the home
// page's poster. Every so often it comes up from behind the letters far
// enough to look about, and goes down again. Follow it (click it) and it
// jumps out and hops away across the screen to the torn corner of the sheet,
// slips under the fold, and the fold lifts for a moment after it.
//
// It is this site's own drawing: white, with an outline and an eye in the
// sheet's blue. The window it comes up in is placed and styled in
// globals.css (see ".rabbit"); the page gives the window its place over the
// letters. The torn corner listens for the "white-rabbit" event (see
// torn-corner.tsx).
//
// For anyone who asks for reduced motion it sits still, part of the way up,
// and following it makes it go without the hopping.

// Sitting up, facing right. "#" is fur and "e" is the eye.
const SITTING = [
  '......##.##...',
  '......##.##...',
  '......##.##...',
  '......##.##...',
  '......#####...',
  '.....#######..',
  '.....####e##..',
  '.....########.',
  '.....#######..',
  '...#########..',
  '..##########..',
  '############..',
  '############..',
  '.###########..',
  '.####..#####..',
  '..###...####..',
]

// In the air, stretched out.
const LEAPING = [
  '.............##...',
  '..............##..',
  '..............####',
  '.....#######.##e##',
  '...###############',
  '.################.',
  '###############...',
  '.####.....####....',
  '###.........###...',
  '##...........###..',
]

// One drawing of the rabbit. Each square of fur is drawn a little large in
// the outline's colour and then at its own size in white, which leaves an
// outline one pixel wide all the way round.
function Sprite({ rows, className }: { rows: string[]; className?: string }) {
  const width = rows[0].length
  const cells = rows.flatMap((row, y) => [...row].map((cell, x) => ({ cell, x, y }))).filter(({ cell }) => cell !== '.')
  return (
    <svg
      className={className}
      viewBox={`-1 -1 ${width + 2} ${rows.length + 2}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {cells.map(({ x, y }) => (
        <rect key={`o${x}-${y}`} className="rabbit-line" x={x - 1} y={y - 1} width={3} height={3} />
      ))}
      {cells.map(({ cell, x, y }) => (
        <rect key={`${x}-${y}`} className={cell === 'e' ? 'rabbit-line' : 'rabbit-fur'} x={x} y={y} width={1} height={1} />
      ))}
    </svg>
  )
}

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value))

export default function WhiteRabbit() {
  const sitter = useRef<HTMLSpanElement>(null)
  const leaper = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  const follow = () => {
    const from = sitter.current?.getBoundingClientRect()
    const runner = leaper.current
    if (!from || !runner || gone) return
    const arrived = () => window.dispatchEvent(new Event('white-rabbit'))
    setGone(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      arrived()
      return
    }

    // Where it is going: the torn corner, at the bottom right of the sheet,
    // inside the frame's band if the frame is showing.
    const band = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--band')) || 0
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const size = clamp(from.width * 1.25, 40, 110)
    const startX = from.left
    const startY = from.bottom - size * 0.6
    const endX = window.innerWidth - band * rem - size * 0.9
    const endY = window.innerHeight - band * rem - size * 0.75
    const distance = Math.hypot(endX - startX, endY - startY)
    const hops = clamp(Math.round(distance / 230), 3, 7)
    const each = 300

    runner.style.width = `${size}px`
    runner.hidden = false
    // Along the ground at a steady pace, and at the end down under the fold.
    const along = runner.animate(
      [
        { transform: `translate(${startX}px, ${startY}px)`, opacity: 1 },
        { transform: `translate(${endX}px, ${endY}px)`, opacity: 1, offset: 0.94 },
        { transform: `translate(${endX + size * 0.3}px, ${endY + size * 0.5}px) scale(0.4)`, opacity: 0 },
      ],
      { duration: hops * each + 160, fill: 'both' },
    )
    // Up and down, once for each hop: quick off the ground and slow at the top.
    runner.firstElementChild?.animate(
      [
        { transform: 'translateY(0)', easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
        { transform: `translateY(${-size * 0.95}px)`, easing: 'cubic-bezier(0.6, 0, 0.8, 0.3)' },
        { transform: 'translateY(0)' },
      ],
      { duration: each, iterations: hops },
    )
    along.finished
      .then(() => {
        runner.hidden = true
        arrived()
      })
      .catch(() => {})
  }

  return (
    <>
      <button
        type="button"
        className="rabbit"
        data-gone={gone || undefined}
        aria-label="A white rabbit. Follow it."
        tabIndex={gone ? -1 : undefined}
        onClick={follow}
      >
        <span ref={sitter} className="rabbit-sitter">
          <Sprite rows={SITTING} />
        </span>
      </button>
      {/* The one that does the hopping, laid over the screen */}
      <span ref={leaper} className="rabbit-leaper" hidden aria-hidden="true">
        <span>
          <Sprite rows={LEAPING} />
        </span>
      </span>
    </>
  )
}
