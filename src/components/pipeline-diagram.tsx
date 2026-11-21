// A drawing of the CI/CD platform's two pipelines for its case study
// (src/app/case-studies/cicd-platform/page.tsx), in the sheet's one ink.
// Outlined steps are ordinary pipeline stages. Inked steps are the ones that
// use the Cloud KMS signing key. A diamond is the merge request's approval:
// "yes" carries on to the right, and "no" loops back to the first step.
//
// Everything is laid out by hand on one grid: steps are 56 high and share a
// centre line per lane, so the arrows between them are straight.

type Step = { x: number; w: number; lines: string[]; inked?: boolean }
type Lane = {
  top: number
  title: string
  steps: Step[]
  // The approval diamond, by its centre, and the step "yes" leads to.
  gate: number
  right: number
}

const WIDTH = 1120
const HEIGHT = 500
const STEP_H = 56
const GATE_W = 132
const GATE_H = 84

const lanes: Lane[] = [
  {
    top: 24,
    title: 'Application pipeline: React, Java, Python, Go',
    gate: 696,
    right: 1100,
    steps: [
      { x: 210, w: 120, lines: ['Secret', 'validation'] },
      { x: 350, w: 120, lines: ['Build'] },
      { x: 490, w: 120, lines: ['SonarQube', 'scan'] },
      { x: 812, w: 120, lines: ['Sign build', 'output'], inked: true },
      { x: 952, w: 128, lines: ['Verify, then', 'deploy to prod'], inked: true },
    ],
  },
  {
    top: 268,
    title: 'Terraform pipeline',
    gate: 556,
    right: 960,
    steps: [
      { x: 210, w: 120, lines: ['Plan', '(plan account)'] },
      { x: 350, w: 120, lines: ['Sign plan'], inked: true },
      { x: 672, w: 128, lines: ['Check signature', 'and drift'], inked: true },
      { x: 820, w: 120, lines: ['Apply', '(apply account)'] },
    ],
  },
]

// Lines of text centred on a point.
function Label({ x, y, lines, className }: { x: number; y: number; lines: string[]; className?: string }) {
  const first = y - ((lines.length - 1) * 16) / 2
  return (
    <text x={x} y={first} className={className} textAnchor="middle" dominantBaseline="central">
      {lines.map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 0 : 16}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

function LaneDrawing({ lane }: { lane: Lane }) {
  const mid = lane.top + 96
  const loop = mid + 74
  const first = lane.steps[0]
  // Arrows run between neighbours: step to step, into the gate and out of it.
  const before = lane.steps.filter((step) => step.x < lane.gate)
  const after = lane.steps.filter((step) => step.x > lane.gate)
  const gateLeft = lane.gate - GATE_W / 2
  const gateRight = lane.gate + GATE_W / 2
  return (
    <g>
      <rect className="pd-lane" x={190} y={lane.top} width={lane.right - 190} height={208} />
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
            d={`M${step.x + step.w} ${mid}H${to - 2}`}
            markerEnd="url(#pd-head)"
          />
        )
      })}
      {after.map((step, index) => {
        const from = index === 0 ? gateRight : after[index - 1].x + after[index - 1].w
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
        d={`M${lane.gate} ${mid + GATE_H / 2}V${loop}H${first.x + first.w / 2}V${mid + STEP_H / 2 + 2}`}
        markerEnd="url(#pd-head)"
      />
      <text className="pd-small" x={(lane.gate + first.x + first.w / 2) / 2} y={loop + 18} textAnchor="middle">
        No: back to the developer
      </text>

      {lane.steps.map((step) => (
        <g key={step.x}>
          <rect
            className={step.inked ? 'pd-step pd-inked' : 'pd-step'}
            x={step.x}
            y={mid - STEP_H / 2}
            width={step.w}
            height={STEP_H}
          />
          <Label
            x={step.x + step.w / 2}
            y={mid}
            lines={step.lines}
            className={step.inked ? 'pd-text pd-on-ink' : 'pd-text'}
          />
        </g>
      ))}

      <path
        className="pd-step"
        d={`M${gateLeft} ${mid}L${lane.gate} ${mid - GATE_H / 2}L${gateRight} ${mid}L${lane.gate} ${mid + GATE_H / 2}Z`}
      />
      <Label x={lane.gate} y={mid} lines={['Merge request', 'approved?']} className="pd-text" />
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
          aria-label="Diagram of the two pipelines. A merge request in Bitbucket starts either one through Workload Identity Federation. The application pipeline runs secret validation, a build and a SonarQube scan. If the merge request is approved, the build output is signed, the signature is verified and it is deployed to production. The Terraform pipeline makes a plan and signs it. If the merge request is approved, the signature and drift are checked and the plan is applied. In both, a merge request that is not approved goes back to the developer."
        >
          <defs>
            <marker id="pd-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto">
              <path className="pd-head" d="M0 0.5L10 5L0 9.5Z" />
            </marker>
          </defs>

          {/* Where both pipelines start */}
          <rect className="pd-step" x={1} y={72} width={149} height={356} />
          <Label x={75} y={214} lines={['Merge request', 'in Bitbucket']} className="pd-text" />
          <Label
            x={75}
            y={286}
            lines={['starts a pipeline', 'through Workload', 'Identity Federation']}
            className="pd-small"
          />

          {lanes.map((lane) => (
            <LaneDrawing key={lane.title} lane={lane} />
          ))}
        </svg>
      </div>
      <figcaption className="caption">
        Fig. 1. The two pipelines. Inked steps use the Cloud KMS signing key. Each team&rsquo;s
        pipelines run as Cloud Run jobs in that team&rsquo;s own GCP project.
      </figcaption>
    </figure>
  )
}
