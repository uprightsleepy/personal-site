// A drawing of the CI/CD platform's two pipelines for its case study
// (src/app/case-studies/cicd-platform/page.tsx), in the sheet's one ink.
//
// There are two kinds of object. Outlined boxes are pipeline steps, in two
// lanes that share the same columns. Solid boxes are the resources the
// steps call, drawn on their own outside the lanes: the Cloud KMS key, the
// Cloud Storage bucket and the plan and apply service accounts in the band
// between the lanes, Workload Identity Federation at the way in, and the
// self-hosted SonarQube server above the application lane. A dotted line
// joins a step to each resource it calls. A diamond is the merge request's approval:
// "yes" carries on to the right, and "no" loops back to the first step.
//
// Every object leads with a symbol. They are plain line drawings made for
// this page, not any vendor's icon set.
//
// Everything is laid out by hand on one grid, and the resources are placed
// so that no two lines cross: each sits between the steps that call it, with
// the key's lines running outside the bucket's. Each lane's title is on its
// outer edge, the top of the upper lane and the bottom of the lower, so the
// calls in the band between them never run through a title.

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
  // Two units of a server rack
  server: 'M4 4H20V10.500H4ZM4 13.500H20V20H4ZM7.500 7.250H8.500M7.500 16.750H8.500M12 7.250H16.500M12 16.750H16.500',
}

type Step = { x: number; symbol: Symbol; lines: string[] }
type Lane = { top: number; title: string; titleAt: 'top' | 'bottom'; steps: Step[] }
type Resource = { x: number; y: number; w: number; h: number; symbol: Symbol; lines: string[] }

const WIDTH = 1200
const HEIGHT = 680
const STEP_W = 108
const STEP_H = 92
const GATE = 672 // the approval diamond's centre, the same in both lanes
const GATE_W = 132
const GATE_H = 92
const RIGHT = 1178

const lanes: Lane[] = [
  {
    top: 76,
    title: 'Application pipeline: React, Java, Python, Go',
    titleAt: 'top',
    steps: [
      { x: 210, symbol: 'lock', lines: ['Secret', 'validation'] },
      { x: 342, symbol: 'box', lines: ['Build'] },
      { x: 474, symbol: 'scan', lines: ['SonarQube', 'scan'] },
      { x: 786, symbol: 'pen', lines: ['Sign build', 'output'] },
      { x: 918, symbol: 'shield', lines: ['Verify', 'signature'] },
      { x: 1050, symbol: 'deploy', lines: ['Deploy to', 'production'] },
    ],
  },
  {
    top: 420,
    title: 'Terraform pipeline',
    titleAt: 'bottom',
    steps: [
      { x: 210, symbol: 'plan', lines: ['Plan'] },
      { x: 342, symbol: 'pen', lines: ['Sign plan'] },
      { x: 474, symbol: 'store', lines: ['Store plan'] },
      { x: 786, symbol: 'read', lines: ['Read plan'] },
      { x: 918, symbol: 'shield', lines: ['Check signature', 'and drift'] },
      { x: 1050, symbol: 'layers', lines: ['Apply'] },
    ],
  },
]

// The resources. Most are in the band between the lanes: the key is on the
// upper row there and the others on the lower, so the key's line to "Sign
// plan" can pass over the bucket. The SonarQube server is above the upper
// lane, because a line down from the scan step would cross that lane's "no"
// loop.
const resources: Resource[] = [
  { x: 453, y: 1, w: 150, h: 40, symbol: 'server', lines: ['Self-hosted', 'SonarQube'] },
  { x: 1, y: 316, w: 149, h: 66, symbol: 'link', lines: ['Workload Identity', 'Federation'] },
  { x: 831, y: 302, w: 150, h: 40, symbol: 'key', lines: ['Cloud KMS key'] },
  { x: 609, y: 356, w: 150, h: 40, symbol: 'bucket', lines: ['Storage bucket'] },
  { x: 189, y: 356, w: 150, h: 40, symbol: 'badge', lines: ['Plan service', 'account'] },
  { x: 1029, y: 356, w: 150, h: 40, symbol: 'badge', lines: ['Apply service', 'account'] },
]

// A dotted line from each step to the resource it calls. Step tops and
// bottoms: the application steps run from 120 to 212, and the Terraform
// steps start at 464.
const calls = [
  // The scan step sends the build to the SonarQube server
  'M528 41V120',
  // Sign build output, and verify signature, use the key
  'M840 212V302',
  'M972 212V302',
  // The key again: sign plan, and check signature
  'M831 322H396V464',
  'M972 342V464',
  // Store plan and read plan use the bucket
  'M609 376H528V464',
  'M759 376H840V464',
  // Plan and apply each run as their own service account
  'M264 396V464',
  'M1104 396V464',
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
  const first = y - ((lines.length - 1) * 15) / 2
  return (
    <text x={x} y={first} className={className} textAnchor={anchor} dominantBaseline="central">
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
      <text className="pd-title" x={204} y={lane.titleAt === 'top' ? lane.top + 24 : lane.top + 184}>
        {lane.title}
      </text>

      {/* In from Workload Identity Federation */}
      <path className="pd-arrow" d={`M170 349V${mid}H${first.x - 2}`} markerEnd="url(#pd-head)" />

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
          aria-label="Diagram of the two pipelines and the resources they call. A merge request in Bitbucket starts either pipeline through Workload Identity Federation. The application pipeline runs secret validation, a build and a scan by the self-hosted SonarQube server. If the merge request is approved, the build output is signed and its signature verified, both using the Cloud KMS key, and it is deployed to production. The Terraform pipeline makes a plan as the plan service account, signs it with the Cloud KMS key and stores it in a Cloud Storage bucket. If the merge request is approved, the plan is read back from the bucket, its signature is checked with the Cloud KMS key along with drift, and it is applied as the apply service account. In both, a merge request that is not approved goes back to the developer."
        >
          <defs>
            <marker id="pd-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path className="pd-head" d="M0 0.5L10 5L0 9.5Z" />
            </marker>
          </defs>

          {/* Where both pipelines start */}
          <rect className="pd-step" x={1} y={120} width={149} height={92} />
          <Glyph symbol="merge" x={61} y={132} />
          <Label x={75} y={186} lines={['Merge request', 'in Bitbucket']} className="pd-small pd-strong" />
          <path className="pd-arrow" d="M75 212V314" markerEnd="url(#pd-head)" />
          <path className="pd-arrow" d="M150 349H170" />

          {lanes.map((lane) => (
            <LaneDrawing key={lane.title} lane={lane} />
          ))}

          {/* Calls from steps to resources, under the resources themselves */}
          {calls.map((d) => (
            <path key={d} className="pd-call" d={d} />
          ))}

          {resources.map((resource) => (
            <g key={`${resource.x}-${resource.y}`} className="pd-resource">
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
          ))}

          {/* What the three kinds of mark mean */}
          <rect className="pd-step" x={204} y={644} width={26} height={16} />
          <text className="pd-small" x={240} y={652} dominantBaseline="central">
            Pipeline step
          </text>
          <rect className="pd-solid" x={364} y={644} width={26} height={16} />
          <text className="pd-small" x={400} y={652} dominantBaseline="central">
            Platform resource
          </text>
          <path className="pd-call" d="M534 652H566" />
          <text className="pd-small" x={576} y={652} dominantBaseline="central">
            A step calling a resource
          </text>
        </svg>
      </div>
      <figcaption className="caption">
        Fig. 1. The two pipelines and the resources they call. Each team&rsquo;s pipelines
        run as Cloud Run jobs in that team&rsquo;s own GCP project.
      </figcaption>
    </figure>
  )
}
