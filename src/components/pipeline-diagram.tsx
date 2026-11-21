"use client"

import { useState } from 'react'
import Reveal from '@/components/reveal'

// A drawing of the CI/CD platform's two pipelines for its case study
// (src/app/case-studies/cicd-platform/page.tsx), in the sheet's one ink.
//
// There are two kinds of object. Outlined boxes are pipeline steps, in two
// lanes that share the same columns. Solid boxes are the resources the
// steps call, drawn on their own outside the lanes: the Cloud KMS key,
// Binary Authorization, the Cloud Storage bucket and the plan and apply
// service accounts and the self-hosted Snyk server in the band between the
// lanes, Workload Identity Federation at the way in, and the self-hosted
// SonarQube server above the application lane. A dotted line joins a step to each resource it calls,
// and joins Binary Authorization to the key it checks signatures against.
// A diamond is the merge request's approval: "yes" carries on to the right,
// and "no" loops back to the first step.
//
// Every object leads with a symbol. They are plain line drawings made for
// this page, not any vendor's icon set.
//
// Everything is laid out by hand on one grid, and the resources are placed
// so that no two lines cross: each sits between the steps that call it, with
// the key's lines running outside the bucket's. Each lane's title is on its
// outer edge, the top of the upper lane and the bottom of the lower, so the
// calls in the band between them never run through a title.
//
// It moves in three ways, all styled in globals.css.
//
// At rest the dotted calls march from caller to resource, the dashed "no"
// loops march back to the first step, and the resources breathe, each a
// little out of step with the others.
//
// The first time it scrolls into view it is drawn in the order a change
// travels: the merge request, the way in, each lane from left to right, then
// the resources and the calls to them. Every piece carries its start time in
// --t. Without scripts, or for anyone who asks for reduced motion, it is
// simply there.
//
// Pointing at a step or a resource (or tapping one) traces its calls: those
// lines and the things at either end stay at full strength, their dots run
// from the caller to the resource, and the rest of the drawing steps back.

type Symbol =
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

// Line drawings on a 24 by 24 grid.
const symbols: Record<Symbol, string> = {
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
}

type Step = { x: number; symbol: Symbol; lines: string[] }
type Lane = { id: string; top: number; title: string; titleAt: 'top' | 'bottom'; steps: Step[] }
type Resource = { id: string; x: number; y: number; w: number; h: number; symbol: Symbol; lines: string[] }
// A call runs from the thing that makes it to the resource it reaches. A
// step's name is its lane's letter and its place in the lane, from 0.
type Call = { d: string; from: string; to: string }

const WIDTH = 1340
const HEIGHT = 696
const STEP_W = 112
const STEP_H = 96
const GATE = 812 // the approval diamond's centre, the same in both lanes
const GATE_W = 144
const GATE_H = 96
const LANE_X = 200
const LANE_H = 206
const RIGHT = 1320

// Four steps before the approval and three after, on the same columns in
// both lanes. Step centres: 276, 406, 536, 666, then 984, 1114, 1244.
const lanes: Lane[] = [
  {
    id: 'a',
    top: 80,
    title: 'Application pipeline: React, Java, Python, Go',
    titleAt: 'top',
    steps: [
      { x: 220, symbol: 'lock', lines: ['Secret', 'validation'] },
      { x: 350, symbol: 'box', lines: ['Build'] },
      { x: 480, symbol: 'test', lines: ['Test'] },
      { x: 610, symbol: 'scan', lines: ['SonarQube', 'scan'] },
      { x: 928, symbol: 'pen', lines: ['Sign build and', 'provenance'] },
      { x: 1058, symbol: 'deploy', lines: ['Deploy to', 'pre-production'] },
      { x: 1188, symbol: 'rollout', lines: ['Roll out to', 'production'] },
    ],
  },
  {
    id: 't',
    top: 434,
    title: 'Terraform pipeline',
    titleAt: 'bottom',
    steps: [
      { x: 220, symbol: 'plan', lines: ['Plan'] },
      { x: 350, symbol: 'policy', lines: ['Checkov', 'policy check'] },
      { x: 480, symbol: 'scan', lines: ['Snyk IaC', 'scan'] },
      { x: 610, symbol: 'pen', lines: ['Sign and', 'store plan'] },
      { x: 928, symbol: 'read', lines: ['Read plan'] },
      { x: 1058, symbol: 'shield', lines: ['Check signature', 'and drift'] },
      { x: 1188, symbol: 'layers', lines: ['Apply'] },
    ],
  },
]

// The resources. Most are in the band between the lanes, in two rows. On
// the upper row are the Snyk server, the key and Binary Authorization; on
// the lower are the bucket and the two service accounts. That lets the
// key's line to "Sign and store plan" pass over the bucket. The SonarQube
// server is above the upper lane, because a line down from the scan step
// would cross that lane's "no" loop. The Snyk server is called from both
// lanes: the line from secret validation avoids the loop by leaving that
// step to the left of where the loop arrives, and the line from the IaC
// scan comes in from the side, a little lower than the key's line so the
// two do not read as one.
const resources: Resource[] = [
  { id: 'sonar', x: 591, y: 1, w: 150, h: 44, symbol: 'server', lines: ['Self-hosted', 'SonarQube'] },
  { id: 'wif', x: 1, y: 327, w: 159, h: 66, symbol: 'link', lines: ['Workload Identity', 'Federation'] },
  { id: 'snyk', x: 200, y: 310, w: 150, h: 44, symbol: 'server', lines: ['Self-hosted', 'Snyk'] },
  { id: 'kms', x: 974, y: 310, w: 150, h: 44, symbol: 'key', lines: ['Cloud KMS key'] },
  { id: 'binauth', x: 1172, y: 310, w: 148, h: 44, symbol: 'shield', lines: ['Binary', 'Authorization'] },
  { id: 'plan-sa', x: 200, y: 366, w: 150, h: 44, symbol: 'badge', lines: ['Plan service', 'account'] },
  { id: 'bucket', x: 750, y: 366, w: 150, h: 44, symbol: 'bucket', lines: ['Storage bucket'] },
  { id: 'apply-sa', x: 1172, y: 366, w: 148, h: 44, symbol: 'badge', lines: ['Apply service', 'account'] },
]

// A dotted line for each call, drawn from the caller to the resource so the
// dots can run that way. Step tops and bottoms: the application steps run
// from 126 to 222, and the Terraform steps start at 480.
const calls: Call[] = [
  // The scan step sends the build to the SonarQube server
  { d: 'M666 126V45', from: 'a3', to: 'sonar' },
  // Secret validation asks the Snyk server
  { d: 'M246 222V310', from: 'a0', to: 'snyk' },
  // Signing the build and its provenance uses the key
  { d: 'M984 222V310', from: 'a4', to: 'kms' },
  // Cloud Run asks Binary Authorization before it runs a new revision in
  // production, and Binary Authorization checks against the key
  { d: 'M1244 222V310', from: 'a6', to: 'binauth' },
  { d: 'M1172 332H1124', from: 'binauth', to: 'kms' },
  // The IaC scan asks the Snyk server too
  { d: 'M536 480V342H350', from: 't2', to: 'snyk' },
  // The key again: sign the plan, and check its signature
  { d: 'M646 480V322H974', from: 't3', to: 'kms' },
  { d: 'M1114 480V354', from: 't5', to: 'kms' },
  // Storing the plan and reading it back use the bucket
  { d: 'M686 480V388H750', from: 't3', to: 'bucket' },
  { d: 'M984 480V388H900', from: 't4', to: 'bucket' },
  // Plan and apply each run as their own service account
  { d: 'M276 480V410', from: 't0', to: 'plan-sa' },
  { d: 'M1244 480V410', from: 't6', to: 'apply-sa' },
]

// Everything that makes or takes a call, and so can be traced.
const traceable = new Set(calls.flatMap((call) => [call.from, call.to]))

// When each piece starts being drawn, in milliseconds from the first.
const AT = {
  trigger: 0,
  toWayIn: 110,
  wayIn: 220,
  lanes: 300,
  intoLanes: 340,
  firstStep: 420,
  column: 90, // from one step to the next
  resources: 1200,
  resource: 50, // from one resource to the next
  calls: 1500,
  call: 35, // from one call to the next
  legend: 1880,
}
const gateAt = AT.firstStep + 4 * AT.column
const stepAt = (index: number) => (index < 4 ? AT.firstStep + index * AT.column : gateAt + 110 + (index - 4) * AT.column)

// The start time, as the style the stylesheet reads.
const at = (ms: number) => ({ '--t': `${ms}ms` }) as React.CSSProperties

// What a traceable thing needs: whether it is part of the trace, and the
// handlers that start and end one.
type Trace = (id: string) => React.SVGAttributes<SVGGElement>

// One symbol, drawn at a size, with its top left corner at a point.
function Glyph({ symbol, x, y, size = 28 }: { symbol: Symbol; x: number; y: number; size?: number }) {
  return (
    <path
      className="pd-glyph"
      d={symbols[symbol]}
      transform={`translate(${x} ${y}) scale(${size / 24})`}
    />
  )
}

// Lines of text. Centred on a point unless `anchor` says otherwise.
function Label({
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

// An outlined box as a path, so its outline can be drawn in.
const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`

function LaneDrawing({ lane, trace }: { lane: Lane; trace: Trace }) {
  const boxTop = lane.top + 46
  const mid = boxTop + STEP_H / 2
  const loop = boxTop + STEP_H + 26
  const first = lane.steps[0]
  // Arrows run between neighbours: step to step, into the gate and out of it.
  const before = lane.steps.filter((step) => step.x < GATE)
  const after = lane.steps.filter((step) => step.x > GATE)
  const gateLeft = GATE - GATE_W / 2
  const gateRight = GATE + GATE_W / 2
  return (
    <g>
      <g className="pd-in" style={at(AT.lanes)}>
        <rect className="pd-lane" x={LANE_X} y={lane.top} width={RIGHT - LANE_X} height={LANE_H} />
        <text
          className="pd-title"
          x={LANE_X + 14}
          y={lane.titleAt === 'top' ? lane.top + 27 : lane.top + LANE_H - 16}
        >
          {lane.title}
        </text>
      </g>

      {/* In from Workload Identity Federation */}
      <g className="pd-in pd-wire" style={at(AT.intoLanes)}>
        <path
          className="pd-arrow pd-draw"
          pathLength={1}
          d={`M180 360V${mid}H${first.x - 2}`}
          markerEnd="url(#pd-head)"
        />
      </g>

      {before.map((step, index) => {
        const next = before[index + 1]
        const to = next ? next.x : gateLeft
        return (
          <g key={step.x} className="pd-in pd-wire" style={at(stepAt(index) + 50)}>
            <path
              className="pd-arrow pd-draw"
              pathLength={1}
              d={`M${step.x + STEP_W} ${mid}H${to - 2}`}
              markerEnd="url(#pd-head)"
            />
          </g>
        )
      })}
      {after.map((step, index) => {
        const from = index === 0 ? gateRight : after[index - 1].x + STEP_W
        return (
          <g key={step.x} className="pd-in pd-wire" style={at(stepAt(index + 4) - 40)}>
            <path
              className="pd-arrow pd-draw"
              pathLength={1}
              d={`M${from} ${mid}H${step.x - 2}`}
              markerEnd="url(#pd-head)"
            />
            {index === 0 && (
              <text className="pd-small" x={(gateRight + step.x) / 2} y={mid - 11} textAnchor="middle">
                Yes
              </text>
            )}
          </g>
        )
      })}

      {/* Not approved: back to the first step */}
      <g className="pd-in pd-wire" style={at(gateAt + 160)}>
        <path
          className="pd-arrow pd-dashed"
          d={`M${GATE} ${mid + GATE_H / 2}V${loop}H${first.x + STEP_W / 2}V${boxTop + STEP_H + 2}`}
          markerEnd="url(#pd-head)"
        />
        <text className="pd-small" x={(GATE + first.x + STEP_W / 2) / 2} y={loop + 20} textAnchor="middle">
          No: back to the developer
        </text>
      </g>

      {lane.steps.map((step, index) => (
        <g key={step.x} style={at(stepAt(index))} {...trace(`${lane.id}${index}`)}>
          <path className="pd-step pd-draw" pathLength={1} d={box(step.x, boxTop, STEP_W, STEP_H)} />
          <Glyph symbol={step.symbol} x={step.x + STEP_W / 2 - 14} y={boxTop + 12} />
          <Label x={step.x + STEP_W / 2} y={boxTop + 68} lines={step.lines} className="pd-small pd-strong" />
        </g>
      ))}

      <g style={at(gateAt)} {...trace(`${lane.id}-gate`)}>
        <path
          className="pd-step pd-draw"
          pathLength={1}
          d={`M${gateLeft} ${mid}L${GATE} ${mid - GATE_H / 2}L${gateRight} ${mid}L${GATE} ${mid + GATE_H / 2}Z`}
        />
        <Label x={GATE} y={mid} lines={['Merge request', 'approved?']} className="pd-small pd-strong" />
      </g>
    </g>
  )
}

export default function PipelineDiagram() {
  // The step or resource whose calls are being traced, if any.
  const [traced, setTraced] = useState<string | null>(null)
  const live = calls.filter((call) => call.from === traced || call.to === traced)
  const ends = new Set(live.flatMap((call) => [call.from, call.to]))

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

  return (
    <figure className="diagram">
      <Reveal className="diagram-scroll">
        <svg
          data-tracing={live.length > 0 || undefined}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Diagram of the two pipelines and the resources they call. A merge request in Bitbucket starts either pipeline through Workload Identity Federation. The application pipeline runs secret validation against the self-hosted Snyk server, a build, tests and a scan by the self-hosted SonarQube server. If the merge request is approved, the build and its provenance are signed with the Cloud KMS key, the build is deployed to pre-production, and it is rolled out to production, where Binary Authorization checks the signature against the Cloud KMS key. The Terraform pipeline makes a plan as the plan service account, checks it with Checkov, scans the infrastructure code with the self-hosted Snyk server, signs the plan with the Cloud KMS key and stores it in a Cloud Storage bucket. If the merge request is approved, the plan is read back from the bucket, its signature is checked with the Cloud KMS key along with drift, and it is applied as the apply service account. In both, a merge request that is not approved goes back to the developer."
        >
          <defs>
            <marker id="pd-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path className="pd-head" d="M0 0.5L10 5L0 9.5Z" />
            </marker>
          </defs>

          {/* Where both pipelines start */}
          <g style={at(AT.trigger)} {...trace('trigger')}>
            <path className="pd-step pd-draw" pathLength={1} d={box(1, 126, 159, 96)} />
            <Glyph symbol="merge" x={66} y={138} />
            <Label x={80} y={194} lines={['Merge request', 'in Bitbucket']} className="pd-small pd-strong" />
          </g>
          <g className="pd-in pd-wire" style={at(AT.toWayIn)}>
            <path className="pd-arrow pd-draw" pathLength={1} d="M80 222V325" markerEnd="url(#pd-head)" />
          </g>
          <g className="pd-in pd-wire" style={at(AT.intoLanes)}>
            <path className="pd-arrow" d="M160 360H180" />
          </g>

          {lanes.map((lane) => (
            <LaneDrawing key={lane.title} lane={lane} trace={trace} />
          ))}

          {/* Calls from steps to resources, under the resources themselves */}
          {calls.map((call, index) => (
            <g key={call.d} className="pd-in" style={at(AT.calls + index * AT.call)}>
              <path className={`pd-call${live.includes(call) ? ' is-live' : ''}`} d={call.d} />
            </g>
          ))}

          {[...resources]
            .sort((one, other) => one.x - other.x)
            .map((resource, index) => (
              <g
                key={resource.id}
                style={at(resource.id === 'wif' ? AT.wayIn : AT.resources + index * AT.resource)}
                {...trace(resource.id)}
              >
                <g className="pd-resource">
                  <rect className="pd-solid" x={resource.x} y={resource.y} width={resource.w} height={resource.h} />
                  <Glyph
                    symbol={resource.symbol}
                    x={resource.x + 12}
                    y={resource.y + resource.h / 2 - 10}
                    size={20}
                  />
                  <Label
                    x={resource.x + 42}
                    y={resource.y + resource.h / 2}
                    lines={resource.lines}
                    className="pd-small pd-strong"
                    anchor="start"
                  />
                </g>
              </g>
            ))}

          {/* What the three kinds of mark mean */}
          <g className="pd-in" style={at(AT.legend)}>
            <rect className="pd-step" x={214} y={660} width={26} height={16} />
            <text className="pd-small" x={250} y={668} dominantBaseline="central">
              Pipeline step
            </text>
            <rect className="pd-solid" x={376} y={660} width={26} height={16} />
            <text className="pd-small" x={412} y={668} dominantBaseline="central">
              Platform resource
            </text>
            <path className="pd-call pd-sample" d="M566 668H598" />
            <text className="pd-small" x={608} y={668} dominantBaseline="central">
              A call to a resource
            </text>
          </g>
        </svg>
      </Reveal>
      <figcaption className="caption">
        Fig. 1. The two pipelines and the resources they call. Each team&rsquo;s pipelines
        run as Cloud Run jobs in that team&rsquo;s own GCP project. Point at or tap a step or
        a resource to trace its calls.
      </figcaption>
    </figure>
  )
}
