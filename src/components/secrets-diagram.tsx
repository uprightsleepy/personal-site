"use client"

import {
  CallLines,
  DiagramWindow,
  Legend,
  ResourceBox,
  StepBox,
  Wire,
  at,
  useTrace,
  type Call,
  type Resource,
  type Step,
} from '@/components/diagram-kit'

// A drawing of how one secret was migrated, for the secrets migration case
// study (src/app/case-studies/secrets-migration/page.tsx). The parts it is
// drawn from, and how it moves, are in diagram-kit.tsx.
//
// It shows only what that page says, and what Henry has said of it since.
//
// The story starts at the lower left. An engineer says what a secret is
// for, through a migration endpoint on a React service that runs on ECS.
// The endpoint puts a message on an SQS queue, and the message starts the
// migration Lambda.
//
// The upper lane is the Lambda working through that one secret: grant
// access to one Vault path, read that secret, copy it to AWS with its
// metadata and tags, revoke the access, and revoke the admin token. Solid
// boxes are what the steps call. The Vault side is above the Lambda: the
// admin role, the reader role and Vault itself, with a small loop under
// Vault for the retries its authentication gets. The AWS side is below: the
// metadata engine, Secrets Manager and the logs.
//
// It is laid out by hand so that no two lines cross. The admin role is
// called by the first step and the last two, from either side of it: the
// first and last steps reach it over the top of the row, and the fourth
// comes in at its side, lower down. The Lambda's lane has no loop drawn
// back to its start, because every step calls up or down across where a
// loop would run. Its title says that it takes one secret at a time, and
// sits at the right of the lane's foot, clear of the calls that leave its
// top and of the line that comes in from the queue.
//
// Every step of the Lambda is logged, so the call to the logs is drawn once,
// from the lane, and belongs to all five steps when it is traced.

const WIDTH = 1340
const HEIGHT = 584
const STEP_W = 160
const STEP_H = 96

// The Lambda's lane. Step centres: 230, 450, 670, 890, 1110.
const LAMBDA = { x: 40, top: 102, w: 1260, h: 178, boxTop: 148 }
const lambdaSteps: Step[] = [
  { x: 150, symbol: 'unlock', lines: ['Grant access to', 'one Vault path'] },
  { x: 370, symbol: 'read', lines: ['Read only', 'that secret'] },
  { x: 590, symbol: 'store', lines: ['Copy to AWS with', 'metadata and tags'] },
  { x: 810, symbol: 'lock', lines: ['Revoke access', 'to the path'] },
  { x: 1030, symbol: 'ban', lines: ['Revoke the', 'admin token'] },
]

// Where a request comes from: the engineer, then the React service's lane
// with the endpoint in it. The endpoint's centre is 375, under the queue.
const ENGINEER: Step = { x: 40, symbol: 'person', lines: ['Engineer says what', 'a secret is for'] }
const SERVICE = { x: 255, top: 388, w: 240, h: 178, boxTop: 434 }
const ENDPOINT: Step = { x: 295, symbol: 'server', lines: ['Migration endpoint', 'adds a message'] }

// The queue the endpoint writes to, which starts the Lambda.
const QUEUE: Resource = { id: 'sqs', x: 300, y: 312, w: 150, h: 44, symbol: 'queue', lines: ['SQS queue'] }

// The Vault side sits in one row above the Lambda, with Vault between the
// two roles that act on it. The AWS side sits in one row below.
const resources: Resource[] = [
  { id: 'reader', x: 375, y: 34, w: 150, h: 44, symbol: 'badge', lines: ['Reader role'] },
  { id: 'vault', x: 550, y: 34, w: 150, h: 44, symbol: 'vault', lines: ['HashiCorp Vault'] },
  { id: 'admin', x: 725, y: 34, w: 150, h: 44, symbol: 'badge', lines: ['Admin role'] },
  { id: 'meta', x: 500, y: 312, w: 150, h: 44, symbol: 'tag', lines: ['Metadata engine'] },
  { id: 'sm', x: 690, y: 312, w: 150, h: 44, symbol: 'key', lines: ['AWS Secrets', 'Manager'] },
  { id: 'logs', x: 1035, y: 312, w: 150, h: 44, symbol: 'plan', lines: ['CloudWatch logs'] },
]

// A dotted line for each call, drawn from the caller to the resource so the
// dots can run that way. The Lambda's steps run from 148 to 244 and the
// endpoint starts at 434. The Lambda's steps are named m0 to m4; "lambda" is
// all of them together.
const calls: Call[] = [
  // The endpoint puts a message on the queue
  { d: 'M375 434V356', from: 'endpoint', to: 'sqs' },
  // The admin role grants the reader role access to the path
  { d: 'M230 148V14H765V34', from: 'm0', to: 'admin' },
  // The Lambda reads the secret as the reader role
  { d: 'M450 148V78', from: 'm1', to: 'reader' },
  // Both roles act on Vault
  { d: 'M525 56H550', from: 'reader', to: 'vault' },
  { d: 'M725 56H700', from: 'admin', to: 'vault' },
  // The copy takes its metadata and tags from the engine and writes to AWS
  { d: 'M640 244V312', from: 'm2', to: 'meta' },
  { d: 'M710 244V312', from: 'm2', to: 'sm' },
  // The reader role's access is revoked, then the admin role's own token
  { d: 'M890 148V56H875', from: 'm3', to: 'admin' },
  { d: 'M1110 148V14H835V34', from: 'm4', to: 'admin' },
  // Every step is logged
  { d: 'M1110 280V312', from: 'lambda', to: 'logs' },
]
const groups = { lambda: lambdaSteps.map((_, index) => `m${index}`) }

// When each piece starts being drawn, in milliseconds from the first.
const AT = {
  engineer: 0,
  service: 110,
  endpoint: 200,
  queue: 360,
  lambda: 420,
  firstStep: 560,
  column: 100, // from one step to the next
  retry: 1080,
  resources: 1150,
  resource: 50, // from one resource to the next
  calls: 1450,
  call: 35, // from one call to the next
  legend: 1850,
}

export default function SecretsDiagram() {
  const { live, trace, tracing } = useTrace(calls, groups)
  const lambdaMid = LAMBDA.boxTop + STEP_H / 2
  const serviceMid = SERVICE.boxTop + STEP_H / 2
  return (
    <DiagramWindow
      width={WIDTH}
      height={HEIGHT}
      name="Migration diagram"
      label="Diagram of how one secret is migrated. An engineer says what a secret is for through a migration endpoint on a React service that runs on ECS. The endpoint adds a message to an SQS queue, and the message starts the migration Lambda, which works through one secret at a time in five steps. First the admin role grants the reader role access to one Vault path. The Lambda then reads only that secret, as the reader role. It copies the secret to AWS Secrets Manager with metadata and tags from the metadata engine. The reader role's access to the path is revoked, and last the admin role revokes its own token. Both roles act on HashiCorp Vault, and authentication to Vault is retried with exponential backoff. Every step is logged to CloudWatch."
      tracing={tracing}
      caption={
        <>
          Fig. 1. One secret&rsquo;s migration, from an engineer&rsquo;s request to the cleanup.
          No role has access to a Vault path before the Lambda reaches it or after it has moved
          on. Point at or tap a step or a resource to trace its calls.
        </>
      }
    >
      {/* Where a request comes from */}
      <StepBox
        id="engineer"
        x={ENGINEER.x}
        y={SERVICE.boxTop}
        w={STEP_W}
        h={STEP_H}
        symbol={ENGINEER.symbol}
        lines={ENGINEER.lines}
        t={AT.engineer}
        trace={trace}
      />
      <g className="pd-in" style={at(AT.service)}>
        <rect className="pd-lane" x={SERVICE.x} y={SERVICE.top} width={SERVICE.w} height={SERVICE.h} />
        {/* At the foot, like the Lambda's, clear of the call up to the queue */}
        <text className="pd-title" x={SERVICE.x + 14} y={SERVICE.top + SERVICE.h - 16}>
          React service on ECS
        </text>
      </g>
      <Wire d={`M${ENGINEER.x + STEP_W} ${serviceMid}H${ENDPOINT.x - 2}`} t={AT.service + 40} />
      <StepBox
        id="endpoint"
        x={ENDPOINT.x}
        y={SERVICE.boxTop}
        w={STEP_W}
        h={STEP_H}
        symbol={ENDPOINT.symbol}
        lines={ENDPOINT.lines}
        t={AT.endpoint}
        trace={trace}
      />

      {/* The message on the queue starts the Lambda */}
      <Wire d={`M${QUEUE.x} 334H110V${lambdaMid}H${lambdaSteps[0].x - 2}`} t={AT.queue + 80} />

      {/* The Lambda's lane */}
      <g className="pd-in" style={at(AT.lambda)}>
        <rect className="pd-lane" x={LAMBDA.x} y={LAMBDA.top} width={LAMBDA.w} height={LAMBDA.h} />
        <text
          className="pd-title"
          x={LAMBDA.x + LAMBDA.w - 14}
          y={LAMBDA.top + LAMBDA.h - 16}
          textAnchor="end"
        >
          Migration Lambda: one secret at a time
        </text>
      </g>
      {lambdaSteps.slice(1).map((step, index) => (
        <Wire
          key={step.x}
          d={`M${lambdaSteps[index].x + STEP_W} ${lambdaMid}H${step.x - 2}`}
          t={AT.firstStep + index * AT.column + 50}
        />
      ))}
      {lambdaSteps.map((step, index) => (
        <StepBox
          key={step.x}
          id={`m${index}`}
          x={step.x}
          y={LAMBDA.boxTop}
          w={STEP_W}
          h={STEP_H}
          symbol={step.symbol}
          lines={step.lines}
          t={AT.firstStep + index * AT.column}
          trace={trace}
        />
      ))}

      {/* Authentication to Vault is tried again when it fails */}
      <Wire dashed d="M605 78V92H645V80" t={AT.retry}>
        <text className="pd-small" x={625} y={124} textAnchor="middle" dominantBaseline="central">
          Authentication retried with exponential backoff
        </text>
      </Wire>

      {/* Calls, under the resources themselves */}
      <CallLines calls={calls} live={live} start={AT.calls} gap={AT.call} />

      <ResourceBox resource={QUEUE} t={AT.queue} trace={trace} />
      {resources.map((resource, index) => (
        <ResourceBox
          key={resource.id}
          resource={resource}
          t={AT.resources + index * AT.resource}
          trace={trace}
        />
      ))}

      <Legend x={580} y={482} t={AT.legend} step="Step" resource="Resource" />
    </DiagramWindow>
  )
}
