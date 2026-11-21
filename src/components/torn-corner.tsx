"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './torn-corner.module.css'

// An easter egg for the home page. The bottom right corner of the sheet is
// torn and folded back a little. Drag the corner up and to the left: it
// peels after the pointer, then the sheet starts to tear, a little further
// with every bit of pull, in the direction it is being pulled. Pull far
// enough and the piece comes away, leaving a music video behind the hole.
//
// The video is a YouTube embed from the no-cookie domain. Nothing is
// requested from YouTube until the sheet is torn, and public/_headers allows
// that one domain to be framed.
//
// How the drawing works. The component owns a 16:9 box pinned to the corner
// of the sheet. Everything is computed in that box's pixel coordinates on
// every frame and written straight to the DOM:
//
//   - The corner of the sheet (C) is folded so that it lands on a point P,
//     which follows the pointer. The fold line is the perpendicular bisector
//     of C and P. The part of the box on C's side of that line is the hole;
//     its mirror image across the line is the folded-back flap, which shows
//     the back of the sheet: the same stock, with the grid and the frame's
//     border showing through in reverse.
//   - The edge of the hole is not the straight fold line but a ragged path
//     that wanders around it, with a band of white fibre where the paper
//     split, a few loose fibres, and a shadow cast into the hole.
//   - As the sheet tears, that path spreads from the fold toward an uneven
//     outline. The outline is different every time (`seed`) and leans the
//     way the corner is pulled (`lean`): pull left and the tear runs along
//     the bottom, pull up and it runs up the side.
const VIDEO = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'

type State = 'idle' | 'dragging' | 'ripping' | 'open' | 'closing'
type Point = [number, number]
type Shape = {
  // Where the folded corner lands, as an offset from the corner.
  tip: Point
  // 0 to 1 as the tear spreads from the fold to the finished outline.
  rip: number
  // Picks this tear's outline. A new one is drawn for every attempt.
  seed: number
  // 0 to 1: how much of the pull is sideways (1) as opposed to upward (0).
  lean: number
}

// Where the corner sits at rest and when the pointer is over it, as offsets
// of P from the corner. Slightly lopsided, so it does not look ruled.
const REST: Point = [-27, -36]
const PEEK: Point = [-40, -54]
// The pull, as a share of the box's height, at which the sheet starts to
// tear and at which it has torn right through.
const TEAR_FROM = 0.5
const TEAR_TO = 1.2
const STEPS = 20 // the tear advances in this many small jerks
const POINTS = 13 // points along the tear's outline

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const mix = (from: Point, to: Point, amount: number): Point => [
  lerp(from[0], to[0], amount),
  lerp(from[1], to[1], amount),
]
const fmt = (point: Point) => `${point[0].toFixed(1)} ${point[1].toFixed(1)}`

// Repeatable noise: the same inputs always give the same value, so a tear
// keeps its shape from frame to frame, and a new seed gives a new tear.
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
const noise = (x: number, seed: number) => {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return lerp(hash(i + seed * 57), hash(i + 1 + seed * 57), u) * 2 - 1
}

// Keep the part of a polygon where a*x + b*y + c >= 0.
function clip(polygon: Point[], a: number, b: number, c: number): Point[] {
  const out: Point[] = []
  for (let i = 0; i < polygon.length; i++) {
    const from = polygon[i]
    const to = polygon[(i + 1) % polygon.length]
    const fromSide = a * from[0] + b * from[1] + c
    const toSide = a * to[0] + b * to[1] + c
    if (fromSide >= 0) out.push(from)
    if (fromSide >= 0 !== toSide >= 0) out.push(mix(from, to, fromSide / (fromSide - toSide)))
  }
  return out
}

// A point on the box's outline, measured clockwise from the top left corner.
function onOutline(u: number, w: number, h: number): Point {
  if (u <= w) return [u, 0]
  if (u <= w + h) return [w, u - w]
  if (u <= 2 * w + h) return [w - (u - w - h), h]
  return [0, h - (u - 2 * w - h)]
}
function outlinePosition(point: Point, w: number, h: number): number {
  const [x, y] = point
  if (Math.abs(y) < 0.01) return x
  if (Math.abs(x - w) < 0.01) return w + y
  if (Math.abs(y - h) < 0.01) return w + h + (w - x)
  return 2 * w + h + (h - y)
}

// The outline a finished tear settles into, from its end on the bottom edge
// to its end on the right edge. It bulges away from the corner like a
// rounded rectangle. `lean` decides how far it reaches along each edge, and
// `seed` gives it its own lumps and bites.
function tornOutline(w: number, h: number, seed: number, lean: number): Point[] {
  const sideways = clamp(lean * 2)
  const upward = clamp((1 - lean) * 2)
  const reachX = (0.52 + 0.47 * sideways) * w
  const reachY = (0.5 + 0.46 * upward) * h
  const bite = 0.2 + hash(seed + 5) * 0.6 // where along the tear one deep bite falls
  const points: Point[] = []
  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1)
    const angle = (t * Math.PI) / 2
    // A squarer curve than a circle, so the opening fills its corner.
    const cx = Math.pow(Math.cos(angle), 0.62)
    const cy = Math.pow(Math.sin(angle), 0.62)
    const pinned = Math.min(1, t * 5, (1 - t) * 5)
    const lumps = noise(t * 5.3, seed + 11) * 0.11 + noise(t * 11.7, seed + 23) * 0.05
    const dent = -0.17 * Math.exp(-Math.pow((t - bite) / 0.07, 2))
    const scale = 1 + (lumps + dent) * pinned
    points.push([
      clamp(w - reachX * cx * scale, w * 0.012, w),
      clamp(h - reachY * cy * scale, h * 0.03, h),
    ])
  }
  return points
}

export default function TornCorner() {
  const box = useRef<HTMLDivElement>(null)
  const hole = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [state, setState] = useState<State>('idle')
  const current = useRef<State>('idle')
  const shape = useRef<Shape>({ tip: REST, rip: 0, seed: 1, lean: 0.5 })
  const tween = useRef(0)
  const audio = useRef<AudioContext | null>(null)

  const move = useCallback((next: State) => {
    current.current = next
    setState(next)
  }, [])

  // The sound of paper giving way: a short burst of filtered noise. `force`
  // runs from a faint tick to the final rip.
  const crackle = useCallback((force: number) => {
    const context = audio.current
    if (!context || context.state !== 'running') return
    const seconds = 0.025 + 0.2 * force * force
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * seconds), context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      // Noise that dies away, with a little grit in it.
      const fade = Math.pow(1 - i / data.length, 1.6)
      data[i] = (Math.random() * 2 - 1) * fade * (0.6 + 0.4 * Math.random())
    }
    const source = context.createBufferSource()
    source.buffer = buffer
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2600 + Math.random() * 2600
    filter.Q.value = 0.6
    const gain = context.createGain()
    gain.gain.value = 0.035 + 0.1 * force
    source.connect(filter).connect(gain).connect(context.destination)
    source.start()
  }, [])

  const draw = useCallback(() => {
    const el = box.current
    const root = svg.current
    if (!el || !root || !hole.current) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const { tip, rip, seed, lean } = shape.current
    const part = (name: string) => root.querySelector<SVGElement>(`[data-part="${name}"]`)!

    // --- The fold --------------------------------------------------------
    const corner: Point = [w, h]
    const p: Point = [clamp(w + tip[0], 8, w - 10), clamp(h + tip[1], 8, h - 10)]
    const mid = mix(corner, p, 0.5)
    const reach = Math.hypot(corner[0] - p[0], corner[1] - p[1])
    // Unit vector across the fold, pointing from the flap toward the corner.
    const nx = (corner[0] - p[0]) / reach
    const ny = (corner[1] - p[1]) / reach
    const c = -(nx * mid[0] + ny * mid[1])
    const rect: Point[] = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ]
    const folded = clip(rect, nx, ny, c)
    const isCorner = (point: Point) =>
      rect.some((r) => Math.abs(r[0] - point[0]) < 0.01 && Math.abs(r[1] - point[1]) < 0.01)
    // The two points where the fold meets the box's outline.
    const ends = folded.filter((point) => !isCorner(point))
    if (ends.length < 2) return
    const positions = ends.map((point) => outlinePosition(point, w, h)).sort((x, y) => x - y)
    const foldUpper = onOutline(positions[0], w, h)
    const foldLower = onOutline(positions[1], w, h)

    // --- The tear's path -------------------------------------------------
    // A row of points that start out spaced along the straight fold and
    // travel to this tear's outline. Its two ends slide along the box's
    // edges. The middle runs ahead of the ends, so it opens from the corner.
    const target = tornOutline(w, h, seed, lean)
    const last = POINTS - 1
    const lowerAt = lerp(positions[1], outlinePosition(target[0], w, h), rip)
    const upperAt = lerp(positions[0], outlinePosition(target[last], w, h), rip)
    const controls: Point[] = target.map((to, index) => {
      if (index === 0) return onOutline(lowerAt, w, h)
      if (index === last) return onOutline(upperAt, w, h)
      const along = index / last
      const lead = clamp(rip * 1.35 - 0.35 * Math.abs(along - 0.5) * 2)
      return mix(mix(foldLower, foldUpper, along), to, lead)
    })

    // --- The ragged edge -------------------------------------------------
    // Walk a smooth curve through those points a few pixels at a time, and
    // roughen it. `centre` is the edge of the hole. `sheet` and `core` are
    // the two sides of the band of white fibre.
    const curve: Point[] = []
    for (let i = 0; i < last; i++) {
      const p0 = controls[Math.max(0, i - 1)]
      const p1 = controls[i]
      const p2 = controls[i + 1]
      const p3 = controls[Math.min(last, i + 2)]
      const steps = Math.max(1, Math.round(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 3.5))
      for (let j = i === 0 ? 0 : 1; j <= steps; j++) {
        const t = j / steps
        // Catmull-Rom: a curve that passes through every control point.
        const at = (k: 0 | 1) =>
          0.5 *
          (2 * p1[k] +
            (p2[k] - p0[k]) * t +
            (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t * t +
            (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t * t * t)
        curve.push([clamp(at(0), 0, w), clamp(at(1), 0, h)])
      }
    }
    const centre: Point[] = []
    const sheet: Point[] = []
    const core: Point[] = []
    const fibres: string[] = []
    let travelled = 0
    for (let i = 0; i < curve.length; i++) {
      const [x, y] = curve[i]
      const before = curve[Math.max(0, i - 1)]
      const after = curve[Math.min(curve.length - 1, i + 1)]
      const length = Math.hypot(after[0] - before[0], after[1] - before[1]) || 1
      if (i > 0) travelled += Math.hypot(x - before[0], y - before[1])
      const s = travelled
      // Normal pointing away from the hole, into the sheet.
      let ax = -(after[1] - before[1]) / length
      let ay = (after[0] - before[0]) / length
      if (ax * (corner[0] - x) + ay * (corner[1] - y) > 0) {
        ax = -ax
        ay = -ay
      }
      // The ends are pinned to the outline; the wander fades in from them.
      const pinned = Math.min(1, i / 3, (curve.length - 1 - i) / 3)
      const wander =
        (noise(s / 16, seed + 1) * 3.4 + noise(s / 5.5, seed + 2) * 1.7 + noise(s / 2.2, seed + 3) * 0.7) *
        pinned
      const tuft = hash(Math.floor(s / 9) + seed + 9) > 0.78 ? 2.6 : 0
      const outer = 1.1 + (noise(s / 7, seed + 4) + 1) * 1.4
      const inner = 1.3 + (noise(s / 6, seed + 5) + 1) * 2.1 + tuft
      centre.push([x + ax * wander, y + ay * wander])
      sheet.push([x + ax * (wander + outer), y + ay * (wander + outer)])
      core.push([x + ax * (wander - inner), y + ay * (wander - inner)])
      // Now and then a loose fibre hangs into the hole.
      if (i % 5 === 2 && hash(Math.floor(s / 17) + seed + 31) > 0.45) {
        const long = 3 + hash(i * 7.3 + seed) * 7
        const sway = (hash(i * 3.1 + seed + 3) - 0.5) * 5
        fibres.push(
          `M${fmt([x + ax * (wander - inner + 0.5), y + ay * (wander - inner + 0.5)])}` +
            `l${(-ax * long - ay * sway).toFixed(1)} ${(-ay * long + ax * sway).toFixed(1)}`,
        )
      }
    }

    // --- The hole --------------------------------------------------------
    // The ragged edge, then round the box's outline through the corner.
    const around: Point[] = []
    if (upperAt < w - 0.01) around.push([w, 0])
    around.push([w, h])
    if (lowerAt > 2 * w + h + 0.01) around.push([0, h])
    const outline = [...centre, ...around]
    hole.current.style.clipPath = `polygon(${outline
      .map((point) => `${point[0].toFixed(1)}px ${point[1].toFixed(1)}px`)
      .join(',')})`
    part('clip').setAttribute('points', outline.map(fmt).join(' '))
    part('shade').setAttribute('d', `M${centre.map(fmt).join('L')}`)
    part('core').setAttribute(
      'd',
      `M${sheet.map(fmt).join('L')}L${[...core].reverse().map(fmt).join('L')}Z`,
    )
    part('fibres').setAttribute('d', fibres.join(''))

    // --- The flap --------------------------------------------------------
    // The folded corner: the fold's straight-edged shape, mirrored across
    // the fold. Once the piece comes away it keeps its last shape while the
    // stylesheet drops it.
    if (current.current === 'idle' || current.current === 'dragging') {
      const mirror = (point: Point): Point => {
        const d = nx * point[0] + ny * point[1] + c
        return [point[0] - 2 * d * nx, point[1] - 2 * d * ny]
      }
      const points = folded.map(mirror).map(fmt).join(' ')
      // The sheet's own edges, as opposed to the fold: start just after the
      // fold and walk round to its other end.
      const foldStart = folded.findIndex(
        (point, index) => !isCorner(point) && !isCorner(folded[(index + 1) % folded.length]),
      )
      const edges = folded.map((_, index) => folded[(foldStart + 1 + index) % folded.length])
      part('flap-border').setAttribute('points', edges.map(mirror).map(fmt).join(' '))
      part('flap').setAttribute('points', points)
      part('flap-edge').setAttribute('points', points)
      part('flap-print').setAttribute('points', points)
      // Shading runs from the crease to the tip of the corner.
      const shading = part('curl')
      shading.setAttribute('x1', mid[0].toFixed(1))
      shading.setAttribute('y1', mid[1].toFixed(1))
      shading.setAttribute('x2', p[0].toFixed(1))
      shading.setAttribute('y2', p[1].toFixed(1))
      // The back of the sheet shows its print faintly, mirrored.
      const k = -2 * c
      part('print').setAttribute(
        'transform',
        `matrix(${1 - 2 * nx * nx} ${-2 * nx * ny} ${-2 * nx * ny} ${1 - 2 * ny * ny} ${k * nx} ${k * ny})`,
      )
    }
  }, [])

  // Ease the shape toward new values, then run `done`.
  const animate = useCallback(
    (to: { tip?: Point; rip?: number }, ms: number, done?: () => void) => {
      cancelAnimationFrame(tween.current)
      const from = { ...shape.current }
      const target = { ...from, ...to }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const start = performance.now()
      const frame = (now: number) => {
        const t = reduced ? 1 : Math.min(1, (now - start) / ms)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        // A rip comes in jerks, not one smooth pull.
        const jerk = to.rip !== undefined && t < 1 ? Math.sin(t * 31) * 0.014 : 0
        shape.current = {
          ...shape.current,
          tip: mix(from.tip, target.tip, eased),
          rip: clamp(lerp(from.rip, target.rip, eased) + jerk),
        }
        draw()
        if (t < 1) tween.current = requestAnimationFrame(frame)
        else done?.()
      }
      tween.current = requestAnimationFrame(frame)
    },
    [draw],
  )

  // The piece comes away. Whatever is left of the tear finishes on its own,
  // quicker the further it had already gone.
  const comeAway = useCallback(() => {
    if (current.current !== 'idle' && current.current !== 'dragging') return
    move('ripping')
    crackle(1)
    navigator.vibrate?.(28)
    const left = 1 - shape.current.rip
    animate({ rip: 1 }, 160 + 520 * left, () => move('open'))
  }, [animate, crackle, move])

  // Closing takes the video away at once, lets the tear run back to the
  // corner, then brings the folded corner back.
  const close = useCallback(() => {
    move('closing')
    animate({ tip: REST, rip: 0 }, 420, () => move('idle'))
  }, [animate, move])

  // Dragging the corner.
  const drag = useRef<{
    x: number
    y: number
    moved: boolean
    step: number
    at: number
    speed: number
    lastX: number
    lastY: number
  } | null>(null)

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (current.current !== 'idle') return
    event.currentTarget.setPointerCapture(event.pointerId)
    cancelAnimationFrame(tween.current)
    // Browsers only let a page make sound once it has been touched.
    try {
      audio.current ??= new AudioContext()
      void audio.current.resume()
    } catch {
      audio.current = null
    }
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
      step: 0,
      at: performance.now(),
      speed: 0,
      lastX: event.clientX,
      lastY: event.clientY,
    }
    // Every attempt tears differently.
    shape.current = { ...shape.current, rip: 0, seed: Math.random() * 1000 }
    move('dragging')
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const origin = drag.current
    if (!origin || current.current !== 'dragging' || !box.current) return
    const dx = Math.min(0, event.clientX - origin.x)
    const dy = Math.min(0, event.clientY - origin.y)
    if (Math.hypot(dx, dy) > 4) origin.moved = true

    // How fast the hand is moving, smoothed, for the moment it lets go.
    const now = performance.now()
    const elapsed = Math.max(1, now - origin.at)
    const speed = Math.hypot(event.clientX - origin.lastX, event.clientY - origin.lastY) / elapsed
    origin.speed = lerp(origin.speed, speed, 0.4)
    origin.at = now
    origin.lastX = event.clientX
    origin.lastY = event.clientY

    const tip: Point = [PEEK[0] + dx, PEEK[1] + dy]
    const height = box.current.offsetHeight
    const pull = Math.hypot(tip[0], tip[1]) / height
    // Past a certain pull the paper tears, and it tears in little jerks: it
    // holds, then gives. Each time it gives there is a tick and, on phones
    // that can, a tap of vibration.
    const raw = clamp((pull - TEAR_FROM) / (TEAR_TO - TEAR_FROM))
    const step = Math.floor(raw * STEPS)
    const within = raw * STEPS - step
    const rip = clamp((step + Math.pow(within, 5)) / STEPS)
    if (step > origin.step) {
      crackle(0.15 + 0.35 * Math.random())
      navigator.vibrate?.(7)
    }
    origin.step = step
    // The tear leans the way it is being pulled. It eases toward the new
    // direction, so a change of mind bends the tear instead of jumping it.
    const sideways = Math.abs(tip[0]) / (Math.abs(tip[0]) + Math.abs(tip[1]) || 1)
    const lean = raw === 0 ? sideways : lerp(shape.current.lean, sideways, 0.18)

    shape.current = { ...shape.current, tip, rip, lean }
    draw()
    if (raw >= 1) {
      drag.current = null
      comeAway()
    }
  }

  const onPointerUp = () => {
    const origin = drag.current
    drag.current = null
    if (current.current !== 'dragging') return
    const { rip } = shape.current
    // Far enough, or let go with a flick, and the piece comes away.
    if (rip > 0.3 || (rip > 0.08 && origin && origin.speed > 0.9)) {
      comeAway()
      return
    }
    move('idle')
    if (origin && !origin.moved) {
      // A plain click gives the corner a tug, as a hint that it pulls.
      animate({ tip: [-84, -96] }, 170, () => animate({ tip: REST }, 300))
    } else {
      // Not far enough: the corner settles back.
      animate({ tip: REST, rip: 0 }, 320)
    }
  }

  // The pointer drags; the keyboard rips in one go, in a direction of its own.
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      shape.current = {
        ...shape.current,
        seed: Math.random() * 1000,
        lean: 0.3 + Math.random() * 0.4,
      }
      comeAway()
    }
  }

  useEffect(() => {
    draw()
    window.addEventListener('resize', draw)
    return () => {
      window.removeEventListener('resize', draw)
      cancelAnimationFrame(tween.current)
      void audio.current?.close()
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

      <svg ref={svg} className={styles.drawing} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="tear-clip">
            <polygon data-part="clip" />
          </clipPath>
          {/* Soft shadow the sheet casts into the hole */}
          <filter id="tear-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          {/*
            The folded corner shows the back of the sheet: the same stock as
            the front, a touch paler, shaded from the crease to the tip. The
            colours come from the stylesheet so both themes work.
          */}
          <linearGradient id="tear-curl" data-part="curl" gradientUnits="userSpaceOnUse">
            <stop offset="0" className={styles.curlCrease} />
            <stop offset="0.07" className={styles.curlShade} />
            <stop offset="0.22" className={styles.curlRidge} />
            <stop offset="0.6" className={styles.curlBack} />
            <stop offset="1" className={styles.curlTip} />
          </linearGradient>
          {/* The drafting grid, showing through the back of the sheet */}
          <pattern id="tear-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" className={styles.ghost} />
          </pattern>
          <clipPath id="tear-flap-clip">
            <polygon data-part="flap-print" />
          </clipPath>
          {/* Paper grain on the flap, and the shadow it casts on the sheet */}
          <filter id="tear-paper" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feOffset in="blur" dx="4" dy="7" result="offset" />
            <feColorMatrix
              in="offset"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.12  0 0 0 0.5 0"
              result="shadow"
            />
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="2" result="grain" />
            <feColorMatrix
              in="grain"
              type="matrix"
              values="0 0 0 0 0.02  0 0 0 0 0.03  0 0 0 0 0.3  0 0 0 0.7 -0.3"
              result="fleck"
            />
            <feComposite in="fleck" in2="SourceAlpha" operator="in" result="grained" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="grained" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow just inside the tear */}
        <g clipPath="url(#tear-clip)">
          <path data-part="shade" className={styles.shade} filter="url(#tear-soft)" />
        </g>

        {/* The folded-back corner */}
        <g className={styles.flap}>
          <g filter="url(#tear-paper)">
            <polygon data-part="flap" fill="url(#tear-curl)" />
            <g clipPath="url(#tear-flap-clip)">
              <rect
                data-part="print"
                x="-2000"
                y="-2000"
                width="4000"
                height="4000"
                fill="url(#tear-grid)"
              />
            </g>
            {/* The frame's border, which runs along these two edges on the front */}
            <polyline data-part="flap-border" className={styles.ghostBorder} />
            <polygon data-part="flap-edge" className={styles.flapEdge} />
          </g>
        </g>

        {/* White fibre where the paper split, and a few loose strands */}
        <path data-part="core" className={styles.core} />
        <path data-part="fibres" className={styles.fibres} />
      </svg>

      {(state === 'idle' || state === 'dragging') && (
        <button
          type="button"
          className={styles.grab}
          aria-label="A torn corner of the drawing. Pull it."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => {
            if (current.current === 'idle') animate({ tip: PEEK }, 200)
          }}
          onPointerLeave={() => {
            if (current.current === 'idle') animate({ tip: REST }, 240)
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
