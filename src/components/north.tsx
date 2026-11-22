"use client"

import { useRef } from 'react'

// The north arrow. Up the page is north, so it is the way back to the top:
// the big one in the footer, and a small one in the pinned navigation.
//
// Following it is a small show (see "Going north" in globals.css). The
// needle shakes itself loose from its ring, then flies up the screen and off
// the top with a dashed line trailing behind it, and the page rides up after
// it to the top. For anyone who asks for reduced motion, and without
// scripts, it is a plain jump to the top.

// The needle alone, on the arrow's 64 by 64 grid: the left half is inked in
// and the right half is outline.
const NEEDLE = '<path class="north-fill" d="M32 2L32 49L18 58Z" /><path d="M32 2L46 58L32 49" />'

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value))

// Where keyboard focus goes once the page is at the top.
function land() {
  document.getElementById('top')?.focus({ preventScroll: true })
}

// Fly the needle of `arrow` off the top of the screen and take the page to
// the top after it.
function goNorth(arrow: SVGSVGElement | null) {
  if (!arrow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, 0)
    land()
    return
  }
  // Already flying.
  if (arrow.dataset.away !== undefined) return

  // A copy of the needle, laid exactly over the real one, does the flying.
  // The real one is hidden until the copy is gone.
  const from = arrow.getBoundingClientRect()
  const flyer = document.createElement('div')
  flyer.className = 'north-flight'
  flyer.setAttribute('aria-hidden', 'true')
  flyer.style.left = `${from.left}px`
  flyer.style.top = `${from.top}px`
  flyer.style.width = `${from.width}px`
  flyer.style.height = `${from.height}px`
  // Far enough to clear the top of the screen, trail and all.
  flyer.style.setProperty('--rise', `${from.bottom + window.innerHeight * 0.5}px`)
  flyer.innerHTML = `<svg viewBox="0 0 64 64">${NEEDLE}</svg>`
  document.body.appendChild(flyer)
  arrow.dataset.away = ''
  flyer.addEventListener('animationend', (event) => {
    if (event.target !== flyer) return
    flyer.remove()
    delete arrow.dataset.away
  })

  // The page follows, once the needle has shaken loose. A long page takes
  // longer, within limits.
  const start = window.scrollY
  const duration = clamp(500 + start * 0.2, 700, 1500)
  const begins = performance.now() + 280
  let frame = 0

  // Anything the reader does to the page takes it back from us.
  const theirs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
  const stop = () => {
    cancelAnimationFrame(frame)
    theirs.forEach((type) => window.removeEventListener(type, stop))
  }
  const step = (now: number) => {
    const part = clamp((now - begins) / duration, 0, 1)
    // Slow out of the start and into the end.
    const eased = part < 0.5 ? 4 * part ** 3 : 1 - (-2 * part + 2) ** 3 / 2
    window.scrollTo(0, start * (1 - eased))
    if (part < 1) {
      frame = requestAnimationFrame(step)
    } else {
      stop()
      land()
    }
  }
  frame = requestAnimationFrame(step)
  // Listen from the next frame on, so the click that started this is over.
  requestAnimationFrame(() => theirs.forEach((type) => window.addEventListener(type, stop, { passive: true })))
}

// The whole arrow: a ring and the needle through it.
function Arrow({ ref }: { ref: React.Ref<SVGSVGElement> }) {
  return (
    <svg ref={ref} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="35" r="22" />
      <path className="north-fill" d="M32 2L32 49L18 58Z" />
      <path d="M32 2L46 58L32 49" />
    </svg>
  )
}

// The link's own jump to #top is what happens without scripts.
function useNorth() {
  const arrow = useRef<SVGSVGElement>(null)
  const follow = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Leave new tabs and the like to the browser.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    goNorth(arrow.current)
  }
  return { arrow, follow }
}

// In the footer, with its label.
export function NorthArrow() {
  const { arrow, follow } = useNorth()
  return (
    <a href="#top" className="north nav-link" onClick={follow}>
      <Arrow ref={arrow} />
      <span>
        <span className="font-bold">N</span>
        <br />
        Back to top
      </span>
    </a>
  )
}

// In the pinned navigation: the arrow alone, at the size of a letter.
export function NorthMark() {
  const { arrow, follow } = useNorth()
  return (
    <a href="#top" className="north-mark" aria-label="Back to top" onClick={follow}>
      <Arrow ref={arrow} />
    </a>
  )
}
