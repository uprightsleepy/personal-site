// A drawing of the CI/CD platform's two pipelines for its case study
// (src/app/case-studies/cicd-platform/page.tsx), in the sheet's one ink.
//
// Each step is a symbol first and a label second, so the flow can be read
// without reading: a padlock for secret validation, a key wherever the Cloud
// KMS signing key is used, a bucket where the plan is stored and read back,
// a badge on the steps that run as a particular service account. The symbols
// are plain line drawings made for this page, not any vendor's icon set. A
// diamond is the merge request's approval: "yes" carries on to the right,
// and "no" loops back to the first step. A key at the foot names the symbols.
//
// Everything is laid out by hand on one grid. Both lanes use the same
// columns, so matching steps line up, and the arrows between steps are
// straight.

type Symbol =
  | 'merge'
  | 'lock'
  | 'box'
  | 'scan'
  | 'key'
  | 'shield'
  | 'deploy'
  | 'plan'
  | 'bucket'
  | 'layers'
  | 'badge'

// Line drawings on a 24 by 24 grid.
const symbols: Record<Symbol, string> = {
  // Two branches joining
  merge: 'M6 8.5V15.5M6 8.5C6 12.5 10 12 15.5 12M6 3.5A2.5 2.5 0 1 0 6 8.5A2.5 2.5 0 1 0 6 3.5M6 15.5A2.5 2.5 0 1 0 6 20.500A2.5 2.5 0 1 0 6 15.5M18 9.500A2.5 2.5 0 1 0 18 14.500A2.5 2.5 0 1 0 18 9.500',
  // A padlock
  lock: 'M5 11H19V21H5ZM8 11V8A4 4 0 0 1 16 8V11M12 15V17.5',
  // A built package
  box: 'M12 2.500L20.500 7V17L12 21.500L3.500 17V7ZM3.500 7L12 11.500L20.500 7M12 11.500V21.500',
  // A magnifying glass
  scan: 'M10.500 4A6.500 6.500 0 1 0 10.500 17A6.500 6.500 0 1 0 10.500 4M15.200 15.200L21 21M7.800 10.700L9.800 12.700L13.400 8.800',
  // A key
  key: 'M8 11.500A4.500 4.500 0 1 0 8 20.500A4.500 4.500 0 1 0 8 11.500M11.200 12.800L20.500 3.500M16.500 7.500L19.500 10.500M13.800 10.200L16 12.400',
  // A shield with a tick
  shield: 'M12 2.500L20 5.500V11.500C20 16.500 16.500 20 12 21.500C7.500 20 4 16.500 4 11.500V5.500ZM8.500 11.800L11 14.300L15.800 9.300',
  // An arrow up into a cloud
  deploy: 'M7 18.500H6.500A4.500 4.500 0 0 1 6 9.600A6 6 0 0 1 17.700 8.600A5 5 0 0 1 17.500 18.500H17M12 21.500V12M8.500 15.200L12 11.700L15.500 15.200',
  // A document
  plan: 'M6 2.500H14.500L18.500 6.500V21.500H6ZM14.500 2.500V6.500H18.500M9 11H15.500M9 14.500H15.500M9 18H13',
  // A storage bucket
  bucket: 'M4 6.500C4 4.800 7.600 3.500 12 3.500C16.400 3.500 20 4.800 20 6.500C20 8.200 16.400 9.500 12 9.500C7.600 9.500 4 8.200 4 6.500ZM4 6.500L6 18.800C6 20 8.700 21 12 21C15.300 21 18 20 18 18.800L20 6.500',
  // Stacked layers of infrastructure
  layers: 'M12 3L21 8L12 13L3 8ZM3 12.500L12 17.500L21 12.500M3 16.500L12 21.500L21 16.500',
  // An identity badge
  badge: 'M4 5.500H20V19.500H4ZM9 9.500A2 2 0 1 0 9 13.500A2 2 0 1 0 9 9.500M6.200 17C6.800 14.800 11.200 14.800 11.800 17M14 10.500H17.500M14 13.500H17.500',
}

type Step = { x: number; symbol: Symbol; lines: string[]; account?: boolean }
type Lane = { top: number; title: string; steps: Step[] }

const WIDTH = 1200
const HEIGHT = 520
const STEP_W = 108
const STEP_H = 92
const GATE = 672 // the approval diamond's centre, the same in both lanes
const GATE_W = 132
const GATE_H = 92
const RIGHT = 1178

const lanes: Lane[] = [
  {
    top: 24,
    title: 'Application pipeline: React, Java, Python, Go',
    steps: [
      { x: 210, symbol: 'lock', lines: ['Secret', 'validation'] },
      { x: 342, symbol: 'box', lines: ['Build'] },
      { x: 474, symbol: 'scan', lines: ['SonarQube', 'scan'] },
      { x: 786, symbol: 'key', lines: ['Sign build', 'output'] },
      { x: 918, symbol: 'shield', lines: ['Verify', 'signature'] },
      { x: 1050, symbol: 'deploy', lines: ['Deploy to', 'production'] },
    ],
  },
  {
    top: 260,
    title: 'Terraform pipeline',
    steps: [
      { x: 210, symbol: 'plan', lines: ['Plan'], account: true },
      { x: 342, symbol: 'key', lines: ['Sign plan'] },
      { x: 474, symbol: 'bucket', lines: ['Store plan'] },
      { x: 786, symbol: 'bucket', lines: ['Read plan'] },
      { x: 918, symbol: 'shield', lines: ['Check signature', 'and drift'] },
      { x: 1050, symbol: 'layers', lines: ['Apply'], account: true },
    ],
  },
]

const legend: [Symbol, string][] = [
  ['key', 'Cloud KMS signing key'],
  ['bucket', 'Cloud Storage bucket'],
  ['badge', 'Runs as its own service account'],
]

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

// Lines of text centred on a point.
function Label({ x, y, lines, className }: { x: number; y: number; lines: string[]; className?: string }) {
  const first = y - ((lines.length - 1) * 15) / 2
  return (
    <text x={x} y={first} className={className} textAnchor="middle" dominantBaseline="central">
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 0 : 15}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

function LaneDrawing({ lane }: { lane: Lane }) {
  const boxTop = lane.top + 44
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
      <rect className="pd-lane" x={190} y={lane.top} width={RIGHT - 190} height={200} />
      <text className="pd-title" x={204} y={lane.top + 24}>
        {lane.title}
      </text>

      {/* In from the merge request */}
      <path className="pd-arrow" d={`M150 ${mid}H${first.x - 2}`} markerEnd="url(#pd-head)" />

      {before.map((step, index) => {
        const next = before[index + 1]
        const to = next ? next.x : gateLeft
        return (
          <path
            key={step.x}
            className="pd-arrow"
            d={`M${step.x + STEP_W} ${mid}H${to - 2}`}
            markerEnd="url(#pd-head)"
          />
        )
      })}
      {after.map((step, index) => {
        const from = index === 0 ? gateRight : after[index - 1].x + STEP_W
        return (
          <path key={step.x} className="pd-arrow" d={`M${from} ${mid}H${step.x - 2}`} markerEnd="url(#pd-head)" />
        )
      })}
      <text className="pd-small" x={(gateRight + after[0].x) / 2} y={mid - 10} textAnchor="middle">
        Yes
      </text>

      {/* Not approved: back to the first step */}
      <path
        className="pd-arrow pd-dashed"
        d={`M${GATE} ${mid + GATE_H / 2}V${loop}H${first.x + STEP_W / 2}V${boxTop + STEP_H + 2}`}
        markerEnd="url(#pd-head)"
      />
      <text className="pd-small" x={(GATE + first.x + STEP_W / 2) / 2} y={loop + 18} textAnchor="middle">
        No: back to the developer
      </text>

      {lane.steps.map((step) => (
        <g key={step.x}>
          <rect className="pd-step" x={step.x} y={boxTop} width={STEP_W} height={STEP_H} />
          <Glyph symbol={step.symbol} x={step.x + STEP_W / 2 - 14} y={boxTop + 12} />
          <Label x={step.x + STEP_W / 2} y={boxTop + 66} lines={step.lines} className="pd-small pd-strong" />
          {step.account && (
            <g>
              {/* A badge on the corner: this step runs as its own service account */}
              <circle className="pd-step" cx={step.x + STEP_W - 4} cy={boxTop + 4} r={15} />
              <Glyph symbol="badge" x={step.x + STEP_W - 14} y={boxTop - 6} size={20} />
            </g>
          )}
        </g>
      ))}

      <path
        className="pd-step"
        d={`M${gateLeft} ${mid}L${GATE} ${mid - GATE_H / 2}L${gateRight} ${mid}L${GATE} ${mid + GATE_H / 2}Z`}
      />
      <Label x={GATE} y={mid} lines={['Merge request', 'approved?']} className="pd-small pd-strong" />
    </g>
  )
}

export default function PipelineDiagram() {
  return (
    <figure className="diagram">
      <div className="diagram-scroll">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="Diagram of the two pipelines. A merge request in Bitbucket starts either one through Workload Identity Federation. The application pipeline runs secret validation, a build and a SonarQube scan. If the merge request is approved, the build output is signed with the Cloud KMS key, the signature is verified and it is deployed to production. The Terraform pipeline makes a plan as the plan service account, signs it with the Cloud KMS key and stores it in a Cloud Storage bucket. If the merge request is approved, the plan is read back from the bucket, its signature and drift are checked, and it is applied as the apply service account. In both, a merge request that is not approved goes back to the developer."
        >
          <defs>
            <marker id="pd-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path className="pd-head" d="M0 0.5L10 5L0 9.5Z" />
            </marker>
          </defs>

          {/* Where both pipelines start */}
          <rect className="pd-step" x={1} y={68} width={149} height={328} />
          <Glyph symbol="merge" x={57} y={150} size={36} />
          <Label x={75} y={214} lines={['Merge request', 'in Bitbucket']} className="pd-small pd-strong" />
          <Label
            x={75}
            y={278}
            lines={['starts a pipeline', 'through Workload', 'Identity Federation']}
            className="pd-small"
          />

          {lanes.map((lane) => (
            <LaneDrawing key={lane.title} lane={lane} />
          ))}

          {/* What the symbols mean */}
          {legend.map(([symbol, meaning], index) => (
            <g key={symbol}>
              <Glyph symbol={symbol} x={204 + index * 250} y={480} size={22} />
              <text className="pd-small" x={234 + index * 250} y={491} dominantBaseline="central">
                {meaning}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="caption">
        Fig. 1. The two pipelines. Each team&rsquo;s pipelines run as Cloud Run jobs in that
        team&rsquo;s own GCP project.
      </figcaption>
    </figure>
  )
}
