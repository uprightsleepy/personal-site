"use client"

import { symbols, type Symbol } from '@/components/diagram-kit'

// A small moving drawing for each piece of work in the home page's index.
// It sits in the empty half of the row, under the title, and shows only
// while the row is under a mouse or holds the keyboard's focus (see
// ".work-scene" in globals.css). Each one is drawn from what that row's
// summary says, in the line-drawn style of the case studies' diagrams.
//
//   secrets-migration  secrets cross from Vault to AWS, one at a time
//   cicd-platform      a change passes scan, validate, sign and deploy
//   spawnpointed       a map loads tile by tile and a pin drops on it
//   badger-politics    four kinds of record go into SQLite and a site comes out
//
// They are decoration, hidden from screen readers. Screens without a mouse
// never show them, and with reduced motion they appear without moving.

// One of the diagrams' symbols, 28 units square, with its corner at a point.
function Glyph({ symbol, x, y }: { symbol: Symbol; x: number; y: number }) {
  return <path className="ws-glyph" d={symbols[symbol]} transform={`translate(${x} ${y}) scale(${28 / 24})`} />
}

// A box with a symbol in it.
function Node({ symbol, x, y, size = 52 }: { symbol: Symbol; x: number; y: number; size?: number }) {
  return (
    <>
      <rect className="ws-box" x={x} y={y} width={size} height={size} />
      <Glyph symbol={symbol} x={x + size / 2 - 14} y={y + size / 2 - 14} />
    </>
  )
}

// A square that travels along a line: `run` is how far, `wait` when it sets off.
function Token({ x, y, run, wait = 0 }: { x: number; y: number; run: number; wait?: number }) {
  return (
    <rect
      className="ws-token"
      x={x}
      y={y - 5}
      width={10}
      height={10}
      style={{ '--run': `${run}px`, '--wait': `${wait}s` } as React.CSSProperties}
    />
  )
}

function Secrets() {
  return (
    <svg viewBox="0 0 420 92">
      <text className="ws-strong" x={210} y={20} textAnchor="middle">
        62,800+ secrets, one at a time
      </text>
      <path className="ws-flow" d="M53 46H367" />
      <Token x={56} y={46} run={298} />
      <Node symbol="vault" x={1} y={20} />
      <Node symbol="key" x={367} y={20} />
      <text x={1} y={90}>
        HashiCorp Vault
      </text>
      <text x={419} y={90} textAnchor="end">
        AWS Secrets Manager
      </text>
    </svg>
  )
}

function Pipeline() {
  const steps: [Symbol, string][] = [
    ['scan', 'Scan'],
    ['lock', 'Validate'],
    ['pen', 'Sign'],
    ['deploy', 'Deploy'],
  ]
  return (
    <svg viewBox="0 0 420 82">
      {steps.map(([symbol, label], index) => {
        const x = 1 + index * 104
        return (
          <g key={label}>
            {index > 0 && <path className="ws-line" d={`M${x - 52} 27H${x - 3}M${x - 10} 21L${x - 3} 27L${x - 10} 33`} />}
            {/* Each step is switched on in its turn */}
            <g className={`ws-step ws-step-${index + 1}`}>
              <Node symbol={symbol} x={x} y={1} />
            </g>
            <text x={x + 26} y={76} textAnchor="middle">
              {label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// The order the map's tiles arrive in.
const ARRIVALS = [9, 3, 14, 0, 17, 6, 11, 20, 2, 8, 15, 5, 12, 19, 1, 10, 16, 4, 13, 7, 18]

function MapAndPin() {
  return (
    <svg viewBox="0 0 420 86">
      {ARRIVALS.map((order, index) => (
        <rect
          key={index}
          className="ws-tile"
          x={1 + (index % 7) * 26}
          y={1 + Math.floor(index / 7) * 26}
          width={26}
          height={26}
          style={{ '--wait': `${order * 0.035}s` } as React.CSSProperties}
        />
      ))}
      {/* A road across the map, and the place the pin lands */}
      <path className="ws-road" pathLength={1} d="M1 60L42 50L80 64L120 34L183 22" />
      <ellipse className="ws-ring" cx={120} cy={34} rx={13} ry={5} />
      <g className="ws-pin">
        <path d="M120 34C108 18 110 4 120 4C130 4 132 18 120 34Z" />
        <circle cx={120} cy={15} r={3.2} />
      </g>
      <text className="ws-strong" x={206} y={36}>
        A daily game
      </text>
      <text x={206} y={56}>
        Tiled map imagery
      </text>
    </svg>
  )
}

function Records() {
  return (
    <svg viewBox="0 0 420 76">
      {[0, 1, 2, 3].map((index) => (
        <Glyph key={index} symbol="plan" x={1 + index * 30} y={8} />
      ))}
      <path className="ws-flow" d="M124 22H228" />
      {[0, 1, 2, 3].map((index) => (
        <Token key={index} x={126} y={22} run={92} wait={index * 0.3} />
      ))}
      {/* The database: a drum */}
      <path
        className="ws-box"
        d="M232 9C232 4 242 1 254 1C266 1 276 4 276 9V35C276 40 266 43 254 43C242 43 232 40 232 35Z"
      />
      <path className="ws-line" d="M232 9C232 14 242 17 254 17C266 17 276 14 276 9M232 22C232 27 242 30 254 30C266 30 276 27 276 22" />
      <path className="ws-flow" d="M276 22H350" />
      <Token x={279} y={22} run={62} wait={1.25} />
      {/* The site: a browser window whose page fills in */}
      <rect className="ws-box" x={354} y={1} width={65} height={42} />
      <path className="ws-line" d="M354 11H419" />
      <path className="ws-page" pathLength={1} d="M362 20H410M362 27H410M362 34H394" />
      <text x={1} y={68}>
        Bills, votes, finance, elections
      </text>
      <text x={254} y={68} textAnchor="middle">
        SQLite
      </text>
      <text x={419} y={68} textAnchor="end">
        Static site
      </text>
    </svg>
  )
}

const scenes: Record<string, () => React.ReactNode> = {
  'secrets-migration': Secrets,
  'cicd-platform': Pipeline,
  spawnpointed: MapAndPin,
  'badger-politics': Records,
}

export default function WorkScene({ slug }: { slug: string }) {
  const Scene = scenes[slug]
  if (!Scene) return null
  return (
    <div className="work-scene" aria-hidden="true">
      <Scene />
    </div>
  )
}
