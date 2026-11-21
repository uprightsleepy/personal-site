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
// It shows only what that page says. The upper lane is the migration Lambda
// working through one secret: grant access to one Vault path, read that
// secret, copy it to AWS with its metadata and tags, revoke the access, and
// revoke the admin token. The lower lane is the user intake that fed the
// metadata. Solid boxes are what the steps call. The Vault side is above
// the Lambda: the admin role, the reader role and Vault itself. The AWS
// side is below it: the metadata engine, Secrets Manager, the queue the
// intake writes to, and the logs.
//
// It is laid out by hand so that no two lines cross. The admin role is
// called by the first step and the last two, from either side of it: the
// first and last steps reach it over the top of the row, and the fourth
// comes in at its side, lower down. The Lambda's lane has no loop drawn
// back to its start, because every step calls up or down across where a
// loop would run. Its title says that it takes one secret at a time, and
// sits at the foot of the lane, clear of the calls that leave its top.
//
// Every step of the Lambda is logged, so the call to the logs is drawn once,
// from the lane, and belongs to all five steps when it is traced.

const WIDTH = 1340
const HEIGHT = 572
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

// The intake lane. Step centres: 170, 375.
const INTAKE = { x: 40, top: 388, w: 465, h: 166, boxTop: 434 }
const intakeSteps: Step[] = [
  { x: 90, symbol: 'person', lines: ['Engineer says what', 'a secret is for'] },
  { x: 295, symbol: 'server', lines: ['Intake', 'microservice'] },
]

// The Vault side sits in one row above the Lambda, with Vault between the
// two roles that act on it. The AWS side sits in one row below.
const resources: Resource[] = [
  { id: 'reader', x: 375, y: 34, w: 150, h: 44, symbol: 'badge', lines: ['Reader role'] },
  { id: 'vault', x: 550, y: 34, w: 150, h: 44, symbol: 'vault', lines: ['HashiCorp Vault'] },
  { id: 'admin', x: 725, y: 34, w: 150, h: 44, symbol: 'badge', lines: ['Admin role'] },
  { id: 'sqs', x: 300, y: 312, w: 150, h: 44, symbol: 'queue', lines: ['SQS queue'] },
  { id: 'meta', x: 500, y: 312, w: 150, h: 44, symbol: 'tag', lines: ['Metadata engine'] },
  { id: 'sm', x: 690, y: 312, w: 150, h: 44, symbol: 'key', lines: ['AWS Secrets', 'Manager'] },
  { id: 'logs', x: 1035, y: 312, w: 150, h: 44, symbol: 'plan', lines: ['CloudWatch logs'] },
]

// A dotted line for each call, drawn from the caller to the resource so the
// dots can run that way. The Lambda's steps run from 148 to 244 and the
// intake's start at 434. Steps are named m0 to m4 and i0, i1; "lambda" is
// all of the Lambda's steps together.
const calls: Call[] = [
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
  // The engine combines its own parsing with what users sent to the queue
  { d: 'M500 334H450', from: 'meta', to: 'sqs' },
  { d: 'M375 434V356', from: 'i1', to: 'sqs' },
  // Every step is logged
  { d: 'M1110 280V312', from: 'lambda', to: 'logs' },
]
const groups = { lambda: lambdaSteps.map((_, index) => `m${index}`) }

// When each piece starts being drawn, in milliseconds from the first.
const AT = {
  lanes: 0,
  firstStep: 150,
  column: 120, // from one step to the next
  intake: 800,
  resources: 1000,
  resource: 50, // from one resource to the next
  calls: 1400,
  call: 35, // from one call to the next
  legend: 1850,
}

export default function SecretsDiagram() {
  const { live, trace, tracing } = useTrace(calls, groups)
  const lambdaMid = LAMBDA.boxTop + STEP_H / 2
  const intakeMid = INTAKE.boxTop + STEP_H / 2
  return (
    <DiagramWindow
      width={WIDTH}
      height={HEIGHT}
      name="Migration diagram"
      label="Diagram of how one secret is migrated. The migration Lambda works through one secret at a time in five steps. First the admin role grants the reader role access to one Vault path. The Lambda then reads only that secret, as the reader role. It copies the secret to AWS Secrets Manager with metadata and tags from the metadata engine. The reader role's access to the path is revoked, and last the admin role revokes its own token. Both roles act on HashiCorp Vault. Every step is logged to CloudWatch. Separately, in the user intake, an engineer says what a secret is for through the intake microservice, which puts that on an SQS queue the metadata engine draws on."
      tracing={tracing}
      caption={
        <>
          Fig. 1. One secret&rsquo;s migration. No role has access to a Vault path before the
          Lambda reaches it or after it has moved on. Point at or tap a step or a resource to
          trace its calls.
        </>
      }
    >
      {/* The Lambda's lane */}
      <g className="pd-in" style={at(AT.lanes)}>
        <rect className="pd-lane" x={LAMBDA.x} y={LAMBDA.top} width={LAMBDA.w} height={LAMBDA.h} />
        {/* At the foot of the lane, clear of the calls that leave its top */}
        <text className="pd-title" x={LAMBDA.x + 14} y={LAMBDA.top + LAMBDA.h - 16}>
          Migration Lambda: one secret at a time
        </text>
      </g>
      {lambdaSteps.slice(1).map((step, index) => (
        <Wire
          key={step.x}
          d={`M${lambdaSteps[index].x + STEP_W} ${lambdaMid}H${step.x - 2}`}
          t={AT.firstStep + index * AT.column + 60}
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

      {/* The intake lane */}
      <g className="pd-in" style={at(AT.intake)}>
        <rect className="pd-lane" x={INTAKE.x} y={INTAKE.top} width={INTAKE.w} height={INTAKE.h} />
        <text className="pd-title" x={INTAKE.x + 14} y={INTAKE.top + 27}>
          User intake
        </text>
      </g>
      <Wire d={`M${intakeSteps[0].x + STEP_W} ${intakeMid}H${intakeSteps[1].x - 2}`} t={AT.intake + 160} />
      {intakeSteps.map((step, index) => (
        <StepBox
          key={step.x}
          id={`i${index}`}
          x={step.x}
          y={INTAKE.boxTop}
          w={STEP_W}
          h={STEP_H}
          symbol={step.symbol}
          lines={step.lines}
          t={AT.intake + 80 + index * AT.column}
          trace={trace}
        />
      ))}

      {/* Calls, under the resources themselves */}
      <CallLines calls={calls} live={live} start={AT.calls} gap={AT.call} />

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
