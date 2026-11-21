"use client"

import { useEffect, useRef, useState } from 'react'
import Reveal from '@/components/reveal'

// The parts the case studies' diagrams are drawn from. Each diagram
// (pipeline-diagram.tsx, secrets-diagram.tsx) lays its own drawing out by
// hand and uses these for the things they share. All of it is styled in
// globals.css, under the pd- and diagram- names.
//
// There are two kinds of object. Outlined boxes are steps, in lanes. Solid
// boxes are the resources the steps call, drawn on their own outside the
// lanes. A dotted line joins a step to each resource it calls. Every object
// leads with a symbol: a plain line drawing made for this site, not any
// vendor's icon set.
//
// A diagram moves in three ways.
//
// At rest the dotted calls march from caller to resource, any dashed loops
// march the way they point, and the resources breathe, each a little out
// of step with the others.
//
// The first time it scrolls into view it is drawn in, in the order its
// story is told. Every piece carries its start time in --t. Without
// scripts, or for anyone who asks for reduced motion, it is simply there.
//
// Pointing at a step or a resource (or tapping one) traces its calls: those
// lines and the things at either end stay at full strength, their dots run
// from the caller to the resource, and the rest of the drawing steps back.
//
// On a screen too narrow for it, a diagram keeps a readable size inside a
// framed window and is moved around by dragging. A finger drags it through
// the browser's own scrolling; a mouse drags it through the handlers here.
// The window has a drawing border and, along its bottom, a title strip.
// There are no scrollbars, so a small key plan in the strip shows which part
// of the drawing is in view.

export type Symbol =
  | 'merge'
  | 'link'
  | 'lock'
  | 'box'
  | 'scan'
  | 'pen'
  | 'key'
  | 'shield'
  | 'deploy'
  | 'plan'
  | 'store'
  | 'read'
  | 'bucket'
  | 'layers'
  | 'badge'
  | 'server'
  | 'test'
  | 'policy'
  | 'rollout'
  | 'unlock'
  | 'tag'
  | 'ban'
  | 'person'
  | 'queue'
  | 'vault'

// Line drawings on a 24 by 24 grid.
export const symbols: Record<Symbol, string> = {
  // Two branches joining
  merge: 'M6 8.5V15.5M6 8.5C6 12.5 10 12 15.5 12M6 3.5A2.5 2.5 0 1 0 6 8.5A2.5 2.5 0 1 0 6 3.5M6 15.5A2.5 2.5 0 1 0 6 20.500A2.5 2.5 0 1 0 6 15.5M18 9.500A2.5 2.5 0 1 0 18 14.500A2.5 2.5 0 1 0 18 9.500',
  // Two links of a chain
  link: 'M10 13.500A4.200 4.200 0 0 0 16 14L19.200 10.800A4.200 4.200 0 0 0 13.200 4.800L11.800 6.200M14 10.500A4.200 4.200 0 0 0 8 10L4.800 13.200A4.200 4.200 0 0 0 10.800 19.200L12.200 17.800',
  // A padlock
  lock: 'M5 11H19V21H5ZM8 11V8A4 4 0 0 1 16 8V11M12 15V17.5',
  // A built package
  box: 'M12 2.500L20.500 7V17L12 21.500L3.500 17V7ZM3.500 7L12 11.500L20.500 7M12 11.500V21.500',
  // A magnifying glass
  scan: 'M10.500 4A6.500 6.500 0 1 0 10.500 17A6.500 6.500 0 1 0 10.500 4M15.200 15.200L21 21M7.800 10.700L9.800 12.700L13.400 8.800',
  // A pen signing on a line
  pen: 'M5 16.500L6 12.500L15.500 3L19 6.500L9.500 16ZM13.500 5L17 8.500M4 20.500H20',
  // A key
  key: 'M8 11.500A4.500 4.500 0 1 0 8 20.500A4.500 4.500 0 1 0 8 11.500M11.200 12.800L20.500 3.500M16.500 7.500L19.500 10.500M13.800 10.200L16 12.400',
  // A shield with a tick
  shield: 'M12 2.500L20 5.500V11.500C20 16.500 16.500 20 12 21.500C7.500 20 4 16.500 4 11.500V5.500ZM8.500 11.800L11 14.300L15.800 9.300',
  // An arrow up into a cloud
  deploy: 'M7 18.500H6.500A4.500 4.500 0 0 1 6 9.600A6 6 0 0 1 17.700 8.600A5 5 0 0 1 17.500 18.500H17M12 21.500V12M8.500 15.200L12 11.700L15.500 15.200',
  // A document
  plan: 'M6 2.500H14.500L18.500 6.500V21.500H6ZM14.500 2.500V6.500H18.500M9 11H15.500M9 14.500H15.500M9 18H13',
  // An arrow down into a tray
  store: 'M12 3V14.500M7.500 10L12 14.500L16.500 10M4 16.500V20.500H20V16.500',
  // An arrow up out of a tray
  read: 'M12 14.500V3M7.500 7.500L12 3L16.500 7.500M4 16.500V20.500H20V16.500',
  // A storage bucket
  bucket: 'M4 6.500C4 4.800 7.600 3.500 12 3.500C16.400 3.500 20 4.800 20 6.500C20 8.200 16.400 9.500 12 9.500C7.600 9.500 4 8.200 4 6.500ZM4 6.500L6 18.800C6 20 8.700 21 12 21C15.300 21 18 20 18 18.800L20 6.500',
  // Stacked layers of infrastructure
  layers: 'M12 3L21 8L12 13L3 8ZM3 12.500L12 17.500L21 12.500M3 16.500L12 21.500L21 16.500',
  // An identity badge
  badge: 'M4 5.500H20V19.500H4ZM9 9.500A2 2 0 1 0 9 13.500A2 2 0 1 0 9 9.500M6.200 17C6.800 14.800 11.200 14.800 11.800 17M14 10.500H17.500M14 13.500H17.500',
  // A laboratory flask
  test: 'M9 3H15M10 3V9L4.500 18.800A1.500 1.500 0 0 0 5.800 21H18.200A1.500 1.500 0 0 0 19.500 18.800L14 9V3M7.300 15H16.700',
  // A clipboard with a tick
  policy: 'M9.500 5H6V21H18V5H14.500M9.500 3.500H14.500V7H9.500ZM9 14L11.200 16.200L15.200 11.800',
  // Rising bars: traffic moved over a share at a time
  rollout: 'M4.500 20.500V16M9.500 20.500V12M14.500 20.500V8M19.500 20.500V4',
  // Two units of a server rack
  server: 'M4 4H20V10.500H4ZM4 13.500H20V20H4ZM7.500 7.250H8.500M7.500 16.750H8.500M12 7.250H16.500M12 16.750H16.500',
  // A padlock with its shackle open
  unlock: 'M5 11H19V21H5ZM8 11V8A4 4 0 0 1 15.600 6.300M12 15V17.5',
  // A luggage tag
  tag: 'M3.500 12.500V4.500H11.500L20.500 13.500L12.500 21.500ZM7.800 7.300A1.200 1.200 0 1 0 7.800 9.700A1.200 1.200 0 1 0 7.800 7.300',
  // A circle struck through
  ban: 'M12 3.500A8.500 8.500 0 1 0 12 20.500A8.500 8.500 0 1 0 12 3.500M6 6L18 18',
  // A person, head and shoulders
  person: 'M12 3.500A4 4 0 1 0 12 11.500A4 4 0 1 0 12 3.500M4.500 21C4.500 16.800 8 14.800 12 14.800C16 14.800 19.500 16.800 19.500 21',
  // Three messages waiting in a row
  queue: 'M3 8H8V16H3ZM9.500 8H14.500V16H9.500ZM16 8H21V16H16Z',
  // A safe, with its dial
  vault: 'M4 4H20V19H4ZM7 19V21M17 19V21M12 8A3.500 3.500 0 1 0 12 15A3.500 3.500 0 1 0 12 8M12 11.500L14.300 9.200',
}

export type Step = { x: number; symbol: Symbol; lines: string[] }
export type Resource = { id: string; x: number; y: number; w: number; h: number; symbol: Symbol; lines: string[] }
// A call runs from the thing that makes it to the resource it reaches.
export type Call = { d: string; from: string; to: string }
// What a traceable thing needs: whether it is part of the trace, and the
// handlers that start and end one.
export type Trace = (id: string) => React.SVGAttributes<SVGGElement>

// A start time, in milliseconds from the first piece, as the style the
// stylesheet reads.
export const at = (ms: number) => ({ '--t': `${ms}ms` }) as React.CSSProperties

// An outlined box as a path, so its outline can be drawn in.
export const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`

// One symbol, drawn at a size, with its top left corner at a point.
export function Glyph({ symbol, x, y, size = 28 }: { symbol: Symbol; x: number; y: number; size?: number }) {
  return (
    <path
      className="pd-glyph"
      d={symbols[symbol]}
      transform={`translate(${x} ${y}) scale(${size / 24})`}
    />
  )
}

// Lines of text. Centred on a point unless `anchor` says otherwise.
export function Label({
  x,
  y,
  lines,
  className,
  anchor = 'middle',
}: {
  x: number
  y: number
  lines: string[]
  className?: string
  anchor?: 'start' | 'middle'
}) {
  const first = y - ((lines.length - 1) * 17) / 2
  return (
    <text x={x} y={first} className={className} textAnchor={anchor} dominantBaseline="central">
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 0 : 17}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

// A step: an outlined box with its symbol over its words.
export function StepBox({
  id,
  x,
  y,
  w,
  h,
  symbol,
  lines,
  t,
  trace,
}: {
  id: string
  x: number
  y: number
  w: number
  h: number
  symbol: Symbol
  lines: string[]
  t: number
  trace: Trace
}) {
  return (
    <g style={at(t)} {...trace(id)}>
      <path className="pd-step pd-draw" pathLength={1} d={box(x, y, w, h)} />
      <Glyph symbol={symbol} x={x + w / 2 - 14} y={y + 12} />
      <Label x={x + w / 2} y={y + 68} lines={lines} className="pd-small pd-strong" />
    </g>
  )
}

// A resource: a solid box with its symbol beside its words.
export function ResourceBox({ resource, t, trace }: { resource: Resource; t: number; trace: Trace }) {
  return (
    <g style={at(t)} {...trace(resource.id)}>
      <g className="pd-resource">
        <rect className="pd-solid" x={resource.x} y={resource.y} width={resource.w} height={resource.h} />
        <Glyph symbol={resource.symbol} x={resource.x + 12} y={resource.y + resource.h / 2 - 10} size={20} />
        <Label
          x={resource.x + 42}
          y={resource.y + resource.h / 2}
          lines={resource.lines}
          className="pd-small pd-strong"
          anchor="start"
        />
      </g>
    </g>
  )
}

// A line of the flow from one step to the next. A solid one is drawn in; a
// dashed one fades in and then marches. Children are words that belong to it.
export function Wire({
  d,
  t,
  dashed = false,
  head = true,
  children,
}: {
  d: string
  t: number
  dashed?: boolean
  head?: boolean
  children?: React.ReactNode
}) {
  return (
    <g className="pd-in pd-wire" style={at(t)}>
      <path
        className={dashed ? 'pd-arrow pd-dashed' : head ? 'pd-arrow pd-draw' : 'pd-arrow'}
        pathLength={dashed || !head ? undefined : 1}
        d={d}
        markerEnd={head ? 'url(#pd-head)' : undefined}
      />
      {children}
    </g>
  )
}

// The dotted calls, each starting a little after the one before.
export function CallLines({ calls, live, start, gap }: { calls: Call[]; live: Call[]; start: number; gap: number }) {
  return (
    <>
      {calls.map((call, index) => (
        <g key={call.d} className="pd-in" style={at(start + index * gap)}>
          <path className={`pd-call${live.includes(call) ? ' is-live' : ''}`} d={call.d} />
        </g>
      ))}
    </>
  )
}

// What the three kinds of mark mean, in a row from a point.
export function Legend({
  x,
  y,
  t,
  step,
  resource,
  call = 'A call to a resource',
}: {
  x: number
  y: number
  t: number
  step: string
  resource: string
  call?: string
}) {
  return (
    <g className="pd-in" style={at(t)}>
      <rect className="pd-step" x={x} y={y - 8} width={26} height={16} />
      <text className="pd-small" x={x + 36} y={y} dominantBaseline="central">
        {step}
      </text>
      <rect className="pd-solid" x={x + 162} y={y - 8} width={26} height={16} />
      <text className="pd-small" x={x + 198} y={y} dominantBaseline="central">
        {resource}
      </text>
      <path className="pd-call pd-sample" d={`M${x + 352} ${y}H${x + 384}`} />
      <text className="pd-small" x={x + 394} y={y} dominantBaseline="central">
        {call}
      </text>
    </g>
  )
}

// Tracing. Returns the calls being traced, and for each traceable thing the
// class and handlers it needs.
//
// `groups` names sets of things that make a call together: a call from a
// group is made by every member of it. Tracing the group's resource lights
// all of its members, and tracing a member lights the group's calls too.
export function useTrace(calls: Call[], groups: Record<string, string[]> = {}) {
  // The step or resource whose calls are being traced, if any.
  const [traced, setTraced] = useState<string | null>(null)

  const inGroup = (group: string, id: string | null) => id !== null && (groups[group] ?? []).includes(id)
  const live = calls.filter(
    (call) => call.from === traced || call.to === traced || inGroup(call.from, traced),
  )
  const ends = new Set<string>()
  for (const call of live) {
    ends.add(call.to)
    const members = groups[call.from]
    if (!members) ends.add(call.from)
    // Traced from the resource, a group's call lights every member; traced
    // from one member, only that member.
    else if (call.to === traced) members.forEach((member) => ends.add(member))
    else if (traced) ends.add(traced)
  }

  // Everything that makes or takes a call, and so can be traced.
  const traceable = new Set(calls.flatMap((call) => [...(groups[call.from] ?? [call.from]), call.to]))

  // A mouse traces while it is over something. A finger has no "over", so a
  // tap starts a trace and a second tap ends it.
  const trace: Trace = (id) => ({
    className: `pd-in pd-node${ends.has(id) ? ' is-live' : ''}`,
    ...(traceable.has(id) && {
      onPointerEnter: (event) => event.pointerType === 'mouse' && setTraced(id),
      onPointerLeave: (event) => event.pointerType === 'mouse' && setTraced(null),
      onPointerUp: (event) => event.pointerType !== 'mouse' && setTraced((now) => (now === id ? null : id)),
    }),
  })

  return { live, trace, tracing: live.length > 0 }
}

// The figure a diagram is shown in: the window it is seen through, the
// frame and title strip that window gets when the drawing has to be dragged,
// and the caption. Its children are the drawing itself, in the units of
// `width` and `height`.
export function DiagramWindow({
  width,
  height,
  name,
  label,
  tracing,
  caption,
  children,
}: {
  width: number
  height: number
  // A short name for the window, for someone reaching it by keyboard.
  name: string
  // The drawing, described in full for someone who cannot see it.
  label: string
  tracing: boolean
  caption: React.ReactNode
  children: React.ReactNode
}) {
  // The window, and whether the drawing is too big for it and so can be
  // dragged around.
  const scroller = useRef<HTMLDivElement>(null)
  const keyPlan = useRef<HTMLDivElement>(null)
  const [pannable, setPannable] = useState(false)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    // Where the window is over the drawing, as shares of the drawing, for
    // the key plan.
    const place = () => {
      const plan = keyPlan.current
      if (!plan) return
      plan.style.setProperty('--x', `${(el.scrollLeft / el.scrollWidth) * 100}%`)
      plan.style.setProperty('--y', `${(el.scrollTop / el.scrollHeight) * 100}%`)
      plan.style.setProperty('--w', `${(el.clientWidth / el.scrollWidth) * 100}%`)
      plan.style.setProperty('--h', `${(el.clientHeight / el.scrollHeight) * 100}%`)
      plan.style.setProperty('--shape', `${el.scrollWidth} / ${el.scrollHeight}`)
    }
    // The observer reports once when it starts, and again on any resize.
    const sizes = new ResizeObserver(() => {
      setPannable(el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
      place()
    })
    sizes.observe(el)
    if (el.firstElementChild) sizes.observe(el.firstElementChild)
    el.addEventListener('scroll', place, { passive: true })
    return () => {
      sizes.disconnect()
      el.removeEventListener('scroll', place)
    }
  }, [])

  // Dragging with a mouse. It only counts as a drag once it has moved a
  // little, so a click is still a click.
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current
    if (!el || !pannable || event.pointerType !== 'mouse' || event.button !== 0) return
    drag.current = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop }
  }
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current
    const from = drag.current
    if (!el || !from) return
    const dx = event.clientX - from.x
    const dy = event.clientY - from.y
    if (Math.abs(dx) + Math.abs(dy) > 3) el.dataset.dragging = ''
    el.scrollLeft = from.left - dx
    el.scrollTop = from.top - dy
  }
  const endDrag = () => {
    drag.current = null
    if (scroller.current) delete scroller.current.dataset.dragging
  }

  return (
    <figure className="diagram" data-pannable={pannable || undefined}>
      <Reveal className="diagram-box">
        {/* When the drawing has to be dragged, this is its frame: a drawing
            border, with a title strip along the bottom. */}
        <div className="diagram-frame">
          <div
            ref={scroller}
            className="diagram-scroll"
            // Reachable by keyboard when there is something to scroll.
            tabIndex={pannable ? 0 : undefined}
            role={pannable ? 'group' : undefined}
            aria-label={pannable ? `${name}. Scroll to see all of it.` : undefined}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="diagram-sheet">
              <svg
                data-tracing={tracing || undefined}
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label={label}
              >
                <defs>
                  <marker
                    id="pd-head"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="9"
                    markerHeight="9"
                    orient="auto"
                  >
                    <path className="pd-head" d="M0 0.5L10 5L0 9.5Z" />
                  </marker>
                </defs>
                {children}
              </svg>
            </div>
          </div>
          <div className="diagram-strip" aria-hidden="true">
            <span>Drag to move around</span>
            {/* Key plan: the whole drawing, with the part in view marked on it */}
            <div className="diagram-key-cell">
              <div ref={keyPlan} className="diagram-key">
                <i />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      <figcaption className="caption">{caption}</figcaption>
    </figure>
  )
}
