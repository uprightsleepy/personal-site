"use client"

import { useCallback, useEffect, useRef } from 'react'

// A line on the About page, "I fight for the users.", and the light that
// underlines it. It is a nod to an old film about life inside a computer,
// made from this site's own parts: the sheet's grid and its one ink.
//
// A point of light comes in from the left edge of the sheet along one of
// the grid's lines, below the words. It runs on past them, turns up a grid
// line, turns back, and runs under the words from right to left, leaving a
// trail the whole way. The trail then fades, all but the part under the
// words, which stays as their underline.
//
// It plays the first time the line is seen, and again when a mouse comes
// back to the words or they are clicked. For anyone who asks for reduced
// motion there is no light, and the words are simply underlined (see
// ".users" in globals.css).

const SPEED = 1.5 // pixels a millisecond
const HEAD = 46 // length of the bright head, in pixels
const GAP = 5 // from the foot of the words to their underline

export default function UsersLine() {
  const line = useRef<HTMLParagraphElement>(null)
  const words = useRef<HTMLSpanElement>(null)
  const lead = useRef<SVGPathElement>(null)
  const under = useRef<SVGPathElement>(null)
  const head = useRef<SVGPathElement>(null)
  const running = useRef(false)

  const run = useCallback(() => {
    const p = line.current
    const phrase = words.current
    const sheet = document.getElementById('top')
    const trail = lead.current
    const rule = under.current
    const point = head.current
    if (!p || !phrase || !sheet || !trail || !rule || !point || running.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Everything is measured from the paragraph's corner, where the
    // drawing's own corner is. The sheet's grid lines are 2.5rem apart, and
    // their centres are half a pixel short of each multiple of that,
    // measured from the sheet's corner.
    const grid = 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    const origin = p.getBoundingClientRect()
    const corner = sheet.getBoundingClientRect()
    const box = phrase.getBoundingClientRect()
    // The first grid line at least `room` past a point, along one axis.
    const next = (at: number, room: number) => Math.ceil((at + room + 0.5) / grid) * grid - 0.5

    const left = box.left - origin.left
    const right = box.right - origin.left
    const underY = box.bottom - origin.top + GAP
    const rowY = next(box.bottom - corner.top + GAP, 22) + corner.top - origin.top
    const turnX = next(box.right - corner.left, 22) + corner.left - origin.left
    const startX = -origin.left - HEAD

    trail.setAttribute('d', `M${startX} ${rowY}H${turnX}V${underY}H${right}`)
    rule.setAttribute('d', `M${right} ${underY}H${left}`)
    point.setAttribute('d', `M${startX} ${rowY}H${turnX}V${underY}H${left}`)

    const leadLength = turnX - startX + (rowY - underY) + (turnX - right)
    const underLength = right - left
    const total = leadLength + underLength
    const share = HEAD / total
    point.style.strokeDasharray = `${share} 2`

    running.current = true
    p.dataset.light = 'run'
    const drawn = [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }]
    trail.animate(drawn, { duration: leadLength / SPEED, fill: 'both' })
    rule.animate(drawn, { duration: underLength / SPEED, delay: leadLength / SPEED, fill: 'both' })
    // The head starts just short of the line and ends just past it.
    const passing = point.animate([{ strokeDashoffset: share }, { strokeDashoffset: -1 }], {
      duration: (total + HEAD) / SPEED,
      fill: 'both',
    })
    passing.finished
      .then(
        () =>
          trail.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, fill: 'both', easing: 'ease-in' })
            .finished,
      )
      .then(() => {
        // The stylesheet's own underline takes over from the drawn one, so
        // it stays in place when the page is resized.
        p.dataset.light = 'done'
        for (const path of [trail, rule, point]) {
          path.getAnimations().forEach((animation) => animation.cancel())
          path.removeAttribute('d')
        }
        running.current = false
      })
      .catch(() => {
        running.current = false
      })
  }, [])

  // The first time the line is properly on screen, after a moment.
  useEffect(() => {
    const p = line.current
    if (!p) return
    let timer = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        timer = window.setTimeout(run, 700)
      },
      { threshold: 1 },
    )
    observer.observe(p)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [run])

  return (
    <p ref={line} className="users">
      <span
        ref={words}
        className="users-words"
        onPointerEnter={(event) => event.pointerType === 'mouse' && run()}
        onClick={run}
      >
        I fight for the users.
      </span>
      <svg className="users-light" aria-hidden="true" focusable="false">
        <path ref={lead} className="users-trail" pathLength={1} />
        <path ref={under} className="users-trail" pathLength={1} />
        <path ref={head} className="users-head" pathLength={1} />
      </svg>
    </p>
  )
}
