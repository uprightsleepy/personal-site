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
// The story starts at the lower left. A user provides a secret's Vault
// path and metadata for it, through a migration endpoint on a React service
// that runs on ECS. The endpoint puts a message on an SQS queue, and the
// message starts the migration Lambda.
//
// The upper lane is the Lambda working through that one secret: grant
// access to one Vault path, read that secret, validate it, copy it to AWS
// with its metadata and tags, revoke the access, and revoke the admin
// token. Solid boxes are what the steps call. The Vault side is above the
// Lambda, as a chain read from the left: the Vault admin role grants and
// revokes the Vault reader role's access, and the reader role reads from
// Vault. Words on those two links say so. A small loop under Vault stands
// for the retries its authentication gets. The AWS side is below: the
// helper Lambda that validates, the metadata engine, Secrets Manager, the
// dead-letter queue and the logs, with the queue at the left of the same
// row.
//
// The Lambda waits for a successful response from everything it calls. If
// anything fails, the message goes to the dead-letter queue. That is not a
// call made by a step but another way out of the lane, so it is a dashed
// arrow from the lane itself, like a "no" on the CI/CD diagram.
//
// It is laid out by hand so that no two lines cross. The admin role is
// called by the first step from below, and by the last two over the top of
// the whole row, one line above the other. The Lambda's lane has no loop
// drawn back to its start, because every step calls up or down across
// where a loop would run. Its title says that it takes one secret at a
// time, and sits at the right of the lane's foot, clear of the calls that
// leave its top and of the line that comes up from the queue.
//
// Every step of the Lambda is logged, so the call to the logs is drawn once,
// from the lane, and belongs to all six steps when it is traced.

const WIDTH = 1340
const HEIGHT = 584
const STEP_W = 160
const STEP_H = 96

// The Lambda's lane. Step centres: 160, 364, 568, 772, 976, 1180.
const LAMBDA = { x: 40, top: 102, w: 1260, h: 178, boxTop: 148 }
const lambdaSteps: Step[] = [
  { x: 80, symbol: 'unlock', lines: ['Grant the reader role', 'one Vault path'] },
  { x: 284, symbol: 'read', lines: ['Read only', 'that secret'] },
  { x: 488, symbol: 'policy', lines: ['Validate', 'the secret'] },
  { x: 692, symbol: 'store', lines: ['Copy to AWS with', 'metadata and tags'] },
  { x: 896, symbol: 'lock', lines: ['Revoke the reader', 'role’s access'] },
  { x: 1100, symbol: 'ban', lines: ['Revoke the', 'admin token'] },
]

// Where a request comes from: the user, then the React service's lane with
// the endpoint in it. The endpoint's centre is 325, under the queue. The
// user's box is wider than a step, to hold its words.
const USER_W = 174
const USER: Step = { x: 1, symbol: 'person', lines: ['User provides the Vault', 'path and its metadata'] }
const SERVICE = { x: 205, top: 388, w: 240, h: 178, boxTop: 434 }
const ENDPOINT: Step = { x: 245, symbol: 'server', lines: ['Migration endpoint', 'adds a message'] }

// The queue the endpoint writes to, which starts the Lambda.
const QUEUE: Resource = { id: 'sqs', x: 250, y: 312, w: 150, h: 44, symbol: 'queue', lines: ['SQS queue'] }

// The Vault side sits in one row above the Lambda, in the order of the
// chain: admin role, reader role, Vault. The AWS side sits in one row below,
// each box under the step that calls it.
const resources: Resource[] = [
  { id: 'admin', x: 40, y: 34, w: 150, h: 44, symbol: 'badge', lines: ['Vault admin role'] },
  { id: 'reader', x: 390, y: 34, w: 150, h: 44, symbol: 'badge', lines: ['Vault reader role'] },
  { id: 'vault', x: 660, y: 34, w: 150, h: 44, symbol: 'vault', lines: ['HashiCorp Vault'] },
  { id: 'helper', x: 420, y: 312, w: 150, h: 44, symbol: 'shield', lines: ['Helper Lambda'] },
  { id: 'meta', x: 590, y: 312, w: 150, h: 44, symbol: 'tag', lines: ['Metadata engine'] },
  { id: 'sm', x: 760, y: 312, w: 150, h: 44, symbol: 'key', lines: ['AWS Secrets', 'Manager'] },
  { id: 'dlq', x: 930, y: 312, w: 150, h: 44, symbol: 'queue', lines: ['Dead-letter', 'queue'] },
  { id: 'logs', x: 1105, y: 312, w: 150, h: 44, symbol: 'plan', lines: ['CloudWatch logs'] },
]

// A dotted line for each call, drawn from the caller to the resource so the
// dots can run that way. The Lambda's steps run from 148 to 244 and the
// endpoint starts at 434. The Lambda's steps are named m0 to m5; "lambda" is
// all of them together.
const calls: Call[] = [
  // The endpoint puts a message on the queue
  { d: 'M325 434V356', from: 'endpoint', to: 'sqs' },
  // The first step has the admin role grant access
  { d: 'M140 148V78', from: 'm0', to: 'admin' },
  // The admin role grants the reader role its access, and later revokes it
  { d: 'M190 62H390', from: 'admin', to: 'reader' },
  // The Lambda reads the secret as the reader role, which reads from Vault
  { d: 'M420 148V78', from: 'm1', to: 'reader' },
  { d: 'M540 62H660', from: 'reader', to: 'vault' },
  // The migration Lambda calls a helper Lambda to validate the secret
  { d: 'M520 244V312', from: 'm2', to: 'helper' },
  // The copy takes its metadata and tags from the engine and writes to AWS
  { d: 'M720 244V312', from: 'm3', to: 'meta' },
  { d: 'M800 244V312', from: 'm3', to: 'sm' },
  // The admin role revokes the reader role's access, then its own token.
  // Both lines go back over the top of the row, the last one outermost.
  { d: 'M976 148V14H150V34', from: 'm4', to: 'admin' },
  { d: 'M1180 148V4H80V34', from: 'm5', to: 'admin' },
  // Every step is logged
  { d: 'M1180 280V312', from: 'lambda', to: 'logs' },
]
const groups = { lambda: lambdaSteps.map((_, index) => `m${index}`) }

// Words on the two links of the Vault chain, above their lines.
const linkWords = [
  { x: 290, text: 'grants and revokes access' },
  { x: 600, text: 'reads the secret' },
]

// When each piece starts being drawn, in milliseconds from the first.
const AT = {
  user: 0,
  service: 110,
  endpoint: 200,
  queue: 360,
  lambda: 420,
  firstStep: 560,
  column: 90, // from one step to the next
  retry: 1100,
  resources: 1180,
  resource: 50, // from one resource to the next
  calls: 1520,
  call: 35, // from one call to the next
  legend: 1950,
}

export default function SecretsDiagram() {
  const { live, trace, tracing } = useTrace(calls, groups)
  const lambdaMid = LAMBDA.boxTop + STEP_H / 2
  const serviceMid = SERVICE.boxTop + STEP_H / 2
  const first = lambdaSteps[0]
  return (
    <DiagramWindow
      width={WIDTH}
      height={HEIGHT}
      name="Migration diagram"
      label="Diagram of how one secret is migrated. A user provides the secret's Vault path and metadata for it, such as the team name and a secret type chosen from a provided list, through a migration endpoint on a React service that runs on ECS. The endpoint adds a message to an SQS queue, and the message starts the migration Lambda, which works through one secret at a time in six steps. First the Vault admin role grants the Vault reader role access to one Vault path. The Lambda then reads only that secret, as the reader role. It calls a helper Lambda to validate the secret. It copies the secret to AWS Secrets Manager with metadata and tags from the metadata engine. The reader role's access to the path is revoked, and last the admin role revokes its own token. The reader role reads from HashiCorp Vault, and authentication to Vault is retried with exponential backoff. Every step is logged to CloudWatch. The Lambda waits for a successful response from everything it calls, and on any failure the message goes to a dead-letter queue."
      tracing={tracing}
      caption={
        <>
          Fig. 1. One secret&rsquo;s migration, from a user&rsquo;s request to the cleanup. No role
          has access to a Vault path before the Lambda reaches it or after it has moved on. Point
          at or tap a step or a resource to trace its calls.
        </>
      }
    >
      {/* Where a request comes from, and what the metadata is */}
      <StepBox
        id="user"
        x={USER.x}
        y={SERVICE.boxTop}
        w={USER_W}
        h={STEP_H}
        symbol={USER.symbol}
        lines={USER.lines}
        t={AT.user}
        trace={trace}
      />
      <g className="pd-in" style={at(AT.user + 60)}>
        {['Metadata: team name,', 'secret type from a', 'provided list, and more'].map((line, index) => (
          <text key={line} className="pd-small" x={USER.x} y={381 + index * 17} dominantBaseline="central">
            {line}
          </text>
        ))}
      </g>
      <g className="pd-in" style={at(AT.service)}>
        <rect className="pd-lane" x={SERVICE.x} y={SERVICE.top} width={SERVICE.w} height={SERVICE.h} />
        {/* At the foot, like the Lambda's, clear of the call up to the queue */}
        <text className="pd-title" x={SERVICE.x + 14} y={SERVICE.top + SERVICE.h - 16}>
          React service on ECS
        </text>
      </g>
      <Wire d={`M${USER.x + USER_W} ${serviceMid}H${ENDPOINT.x - 2}`} t={AT.service + 40} />
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

      {/* The message on the queue starts the Lambda, at its first step */}
      <Wire
        d={`M${QUEUE.x} 334H${first.x + STEP_W / 2}V${LAMBDA.boxTop + STEP_H + 2}`}
        t={AT.queue + 80}
      />

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
      <Wire dashed d="M715 78V92H755V80" t={AT.retry}>
        <text className="pd-small" x={956} y={124} textAnchor="end" dominantBaseline="central">
          Authentication retried with exponential backoff
        </text>
      </Wire>

      {/* A failure anywhere in the Lambda sends the message to the dead-letter queue */}
      <Wire dashed d={`M1005 ${LAMBDA.top + LAMBDA.h}V310`} t={AT.retry + 60}>
        <text className="pd-small" x={1016} y={296} dominantBaseline="central">
          On failure
        </text>
      </Wire>

      {/* Calls, under the resources themselves */}
      <CallLines calls={calls} live={live} start={AT.calls} gap={AT.call} />
      <g className="pd-in" style={at(AT.calls + 100)}>
        {linkWords.map((words) => (
          <text
            key={words.text}
            className="pd-small"
            x={words.x}
            y={46}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {words.text}
          </text>
        ))}
      </g>

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
