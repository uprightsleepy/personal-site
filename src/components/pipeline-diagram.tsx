"use client"

import {
  CallLines,
  DiagramWindow,
  Label,
  Legend,
  ResourceBox,
  StepBox,
  Wire,
  at,
  useTrace,
  type Call,
  type Resource,
  type Step,
  type Trace,
} from '@/components/diagram-kit'

// A drawing of the CI/CD platform's two pipelines for its case study
// (src/app/case-studies/cicd-platform/page.tsx), in the sheet's one ink.
// The parts it is drawn from, and how it moves, are in diagram-kit.tsx.
//
// Outlined boxes are pipeline steps, in two lanes that share the same
// columns. Solid boxes are the resources the steps call, drawn on their own
// outside the lanes: the Cloud KMS key, Binary Authorization, the Cloud
// Storage bucket, the plan and apply service accounts and the self-hosted
// Snyk server in the band between the lanes, Workload Identity Federation
// at the way in, and the self-hosted SonarQube server above the application
// lane. A dotted line joins a step to each resource it calls, and joins
// Binary Authorization to the key it checks signatures against. A diamond
// is the merge request's approval: "yes" carries on to the right, and "no"
// loops back to the first step.
//
// Everything is laid out by hand on one grid, and the resources are placed
// so that no two lines cross: each sits between the steps that call it, with
// the key's lines running outside the bucket's. Each lane's title is on its
// outer edge, the top of the upper lane and the bottom of the lower, so the
// calls in the band between them never run through a title.
//
// It is drawn in the order a change travels: the merge request, the way in,
// each lane from left to right, then the resources and the calls to them.
// A step's name, for tracing, is its lane's letter and its place in the
// lane, from 0.

type Lane = { id: string; top: number; title: string; titleAt: 'top' | 'bottom'; steps: Step[] }

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
      <Wire d={`M180 360V${mid}H${first.x - 2}`} t={AT.intoLanes} />

      {before.map((step, index) => {
        const next = before[index + 1]
        const to = next ? next.x : gateLeft
        return <Wire key={step.x} d={`M${step.x + STEP_W} ${mid}H${to - 2}`} t={stepAt(index) + 50} />
      })}
      {after.map((step, index) => {
        const from = index === 0 ? gateRight : after[index - 1].x + STEP_W
        return (
          <Wire key={step.x} d={`M${from} ${mid}H${step.x - 2}`} t={stepAt(index + 4) - 40}>
            {index === 0 && (
              <text className="pd-small" x={(gateRight + step.x) / 2} y={mid - 11} textAnchor="middle">
                Yes
              </text>
            )}
          </Wire>
        )
      })}

      {/* Not approved: back to the first step */}
      <Wire
        dashed
        d={`M${GATE} ${mid + GATE_H / 2}V${loop}H${first.x + STEP_W / 2}V${boxTop + STEP_H + 2}`}
        t={gateAt + 160}
      >
        <text className="pd-small" x={(GATE + first.x + STEP_W / 2) / 2} y={loop + 20} textAnchor="middle">
          No: back to the developer
        </text>
      </Wire>

      {lane.steps.map((step, index) => (
        <StepBox
          key={step.x}
          id={`${lane.id}${index}`}
          x={step.x}
          y={boxTop}
          w={STEP_W}
          h={STEP_H}
          symbol={step.symbol}
          lines={step.lines}
          t={stepAt(index)}
          trace={trace}
        />
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
  const { live, trace, tracing } = useTrace(calls)
  return (
    <DiagramWindow
      width={WIDTH}
      height={HEIGHT}
      name="Pipeline diagram"
      label="Diagram of the two pipelines and the resources they call. A merge request in Bitbucket starts either pipeline through Workload Identity Federation. The application pipeline runs secret validation against the self-hosted Snyk server, a build, tests and a scan by the self-hosted SonarQube server. If the merge request is approved, the build and its provenance are signed with the Cloud KMS key, the build is deployed to pre-production, and it is rolled out to production, where Binary Authorization checks the signature against the Cloud KMS key. The Terraform pipeline makes a plan as the plan service account, checks it with Checkov, scans the infrastructure code with the self-hosted Snyk server, signs the plan with the Cloud KMS key and stores it in a Cloud Storage bucket. If the merge request is approved, the plan is read back from the bucket, its signature is checked with the Cloud KMS key along with drift, and it is applied as the apply service account. In both, a merge request that is not approved goes back to the developer."
      tracing={tracing}
      caption={
        <>
          Fig. 1. The two pipelines and the resources they call. Each team&rsquo;s pipelines run as
          Cloud Run jobs in that team&rsquo;s own GCP project. Point at or tap a step or a resource
          to trace its calls.
        </>
      }
    >
      {/* Where both pipelines start */}
      <StepBox
        id="trigger"
        x={1}
        y={126}
        w={159}
        h={96}
        symbol="merge"
        lines={['Merge request', 'in Bitbucket']}
        t={AT.trigger}
        trace={trace}
      />
      <Wire d="M80 222V325" t={AT.toWayIn} />
      <Wire d="M160 360H180" t={AT.intoLanes} head={false} />

      {lanes.map((lane) => (
        <LaneDrawing key={lane.title} lane={lane} trace={trace} />
      ))}

      {/* Calls from steps to resources, under the resources themselves */}
      <CallLines calls={calls} live={live} start={AT.calls} gap={AT.call} />

      {[...resources]
        .sort((one, other) => one.x - other.x)
        .map((resource, index) => (
          <ResourceBox
            key={resource.id}
            resource={resource}
            t={resource.id === 'wif' ? AT.wayIn : AT.resources + index * AT.resource}
            trace={trace}
          />
        ))}

      <Legend x={214} y={668} t={AT.legend} step="Pipeline step" resource="Platform resource" />
    </DiagramWindow>
  )
}
