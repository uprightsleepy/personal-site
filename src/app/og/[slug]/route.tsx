import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { sheetNumber, sheets } from '@/lib/sheets'
import metrics from '../fonts/metrics.json'

// Social preview images (the picture a link to the site unfurls into) are
// rendered once at build time and exported as static PNGs (/og/home.png,
// /og/about.png, ...), so the site needs no server or edge function. To add
// an image, add an entry to `images` and point the page's metadata at
// /og/<key>.
//
// Each one is a small sheet from the same drawing set as the site: the
// blueprint frame with its zone marks, a title block, and the page's title
// set as a poster. Every poster line is a different width of Archivo, sized
// so it fills the measure. The image renderer cannot use a variable font, so
// the widths are separate font files in ../fonts, built by
// scripts/build-og-fonts.py along with metrics.json, which records how wide
// each character is.
export const dynamic = 'force-static'
export const dynamicParams = false

type Width = '62' | '84' | '100' | '125'

type Line = {
  text: string
  // Which width of the typeface the line is set in.
  width: Width
  // Drawn as an outline in place of solid ink.
  outline?: boolean
}

type OgImage = {
  // The page this image belongs to, for the sheet number in the title block.
  path: string
  lines: Line[]
  stamp?: string
}

const images: Record<string, OgImage> = {
  'home.png': {
    path: '/',
    lines: [
      { text: 'Henry Phillips', width: '100' },
      { text: 'is an application', width: '62', outline: true },
      { text: 'and cloud security', width: '84' },
      { text: 'engineer.', width: '125', outline: true },
    ],
    stamp: 'Not for construction',
  },
  'about.png': {
    path: '/about',
    lines: [
      { text: 'About', width: '125' },
      { text: 'From graphic design', width: '62', outline: true },
      { text: 'to software to security', width: '100' },
    ],
  },
  'blog.png': {
    path: '/blog',
    lines: [
      { text: 'Writing', width: '125' },
      { text: 'AI tooling', width: '62', outline: true },
      { text: 'and its security', width: '100' },
    ],
  },
  'case-studies.png': {
    path: '/case-studies',
    lines: [
      { text: 'Work', width: '125', outline: true },
      { text: 'Secrets migration, CI/CD platform,', width: '62' },
      { text: 'Spawnpointed, Badger Politics', width: '100' },
    ],
  },
  'secrets-migration.png': {
    path: '/case-studies/secrets-migration',
    lines: [
      { text: 'Secrets migration', width: '62' },
      { text: '62,800+ secrets', width: '125', outline: true },
      { text: 'HashiCorp Vault to', width: '100' },
      { text: 'AWS Secrets Manager', width: '84', outline: true },
    ],
    stamp: 'As built',
  },
}

const BLUE = '#1b22d2'
const INK = '#ffffff'

// Geometry of the sheet, in pixels.
const WIDTH = 1200
const HEIGHT = 630
const BAND = 26 // the frame's zone band
const INSET = 24 // space between the frame and the drawing
const TITLE_BLOCK = 58
const GAP = 20 // between the poster and the title block
const MEASURE = WIDTH - (BAND + INSET) * 2
const POSTER_HEIGHT = HEIGHT - (BAND + INSET) * 2 - TITLE_BLOCK - GAP
const LEADING = 0.8 // line height of the poster, in ems
const LINE_GAP = 7 // extra space between poster lines, in pixels

const zoneColumns = ['1', '2', '3', '4', '5', '6', '7', '8']
const zoneRows = ['A', 'B', 'C', 'D']

// Width of a line in ems, read from the recorded character widths.
function ems(line: Line): number {
  const advance = metrics[line.width].advance as Record<string, number>
  return Array.from(line.text.toUpperCase()).reduce(
    (total, character) => total + (advance[character] ?? advance['n']),
    0,
  )
}

// Type size for each line so that it fills the measure. If the lines would
// then be too tall for the sheet, all of them shrink together.
function fit(lines: Line[]): number[] {
  const sizes = lines.map((line) => (MEASURE * 0.992) / ems(line))
  const height = sizes.reduce((total, size) => total + size * LEADING, 0)
  const gaps = LINE_GAP * (lines.length - 1)
  const scale = Math.min(1, (POSTER_HEIGHT - gaps) / height)
  return sizes.map((size) => size * scale)
}

function loadFont(file: string) {
  return readFile(path.join(process.cwd(), file))
}

export function generateStaticParams() {
  return Object.keys(images).map((slug) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const image = images[slug]
  if (!image) {
    return new Response('Not found', { status: 404 })
  }

  const widths: Width[] = ['62', '84', '100', '125']
  const [regular, semibold, ...poster] = await Promise.all([
    loadFont('node_modules/@fontsource/archivo/files/archivo-latin-400-normal.woff'),
    loadFont('node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff'),
    ...widths.map((width) => loadFont(`src/app/og/fonts/archivo-${width}-800.ttf`)),
  ])

  const sizes = fit(image.lines)
  const sheet = sheetNumber(image.path)
  const sheetTitle = sheets.find((entry) => entry.path === image.path)?.title ?? ''

  const cell = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 16px',
    borderRight: `2px solid ${INK}`,
  } as const
  const label = { display: 'flex', fontSize: 13, color: '#d0d2f8' } as const
  const value = { display: 'flex', fontSize: 19, fontWeight: 600, marginTop: 2 } as const

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: BLUE,
          color: INK,
          fontFamily: 'Archivo',
        }}
      >
        {/* Zone numbers across the top and bottom of the frame */}
        {[0, HEIGHT - BAND].map((top) => (
          <div
            key={top}
            style={{
              position: 'absolute',
              top,
              left: BAND,
              width: WIDTH - BAND * 2,
              height: BAND,
              display: 'flex',
            }}
          >
            {zoneColumns.map((zone, index) => (
              <div
                key={zone}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  borderLeft: index === 0 ? 'none' : `1px solid ${INK}`,
                }}
              >
                {zone}
              </div>
            ))}
          </div>
        ))}

        {/* Zone letters down both sides */}
        {[0, WIDTH - BAND].map((left) => (
          <div
            key={left}
            style={{
              position: 'absolute',
              top: BAND,
              left,
              width: BAND,
              height: HEIGHT - BAND * 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {zoneRows.map((zone, index) => (
              <div
                key={zone}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  borderTop: index === 0 ? 'none' : `1px solid ${INK}`,
                }}
              >
                {zone}
              </div>
            ))}
          </div>
        ))}

        {/* The sheet inside the frame, with the drafting grid */}
        <div
          style={{
            position: 'absolute',
            top: BAND,
            left: BAND,
            width: WIDTH - BAND * 2,
            height: HEIGHT - BAND * 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: INSET,
            border: `2px solid ${INK}`,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        >
          {/* The poster: every line fills the measure in its own width */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {image.lines.map((line, index) => (
              <div
                key={line.text}
                style={{
                  display: 'flex',
                  height: sizes[index] * LEADING,
                  marginTop: index === 0 ? 0 : LINE_GAP,
                  alignItems: 'center',
                  fontFamily: `Poster${line.width}`,
                  fontWeight: 800,
                  fontSize: sizes[index],
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  // Outlined lines are filled with the sheet's blue, since the
                  // renderer draws nothing for transparent text.
                  ...(line.outline
                    ? {
                        color: BLUE,
                        // The stroke is centred on the letter's edge, so half shows.
                        WebkitTextStrokeWidth: Math.max(3, sizes[index] * 0.034),
                        WebkitTextStrokeColor: INK,
                      }
                    : {}),
                }}
              >
                {line.text}
              </div>
            ))}
          </div>

          {/* Title block, with a rubber stamp beside it where the sheet has one */}
          <div style={{ display: 'flex', alignItems: 'center', height: TITLE_BLOCK }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                height: TITLE_BLOCK,
                border: `2px solid ${INK}`,
                borderRight: 'none',
                background: BLUE,
              }}
            >
              <div style={{ ...cell, flex: 1.3 }}>
                <div style={label}>Drawn by</div>
                <div style={value}>Henry Phillips</div>
              </div>
              <div style={{ ...cell, flex: 1.3 }}>
                <div style={label}>Title</div>
                <div style={value}>{sheetTitle}</div>
              </div>
              <div style={{ ...cell, flex: 0.9 }}>
                <div style={label}>Sheet</div>
                <div style={value}>{sheet ? `${sheet} of ${sheets.length}` : 'None'}</div>
              </div>
              {/* The ink cell gives way to the stamp */}
              {!image.stamp && (
                <div style={{ ...cell, flex: 1.2 }}>
                  <div style={label}>Ink</div>
                  <div style={{ ...value, alignItems: 'center' }}>
                    One, white
                    <div
                      style={{
                        display: 'flex',
                        marginLeft: 12,
                        border: `2px solid ${INK}`,
                      }}
                    >
                      {[1, 0.75, 0.5, 0.25].map((tint) => (
                        <div
                          key={tint}
                          style={{ width: 13, height: 13, background: INK, opacity: tint }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  ...cell,
                  flex: 1.4,
                  alignItems: 'flex-end',
                  fontFamily: 'Poster100',
                  fontWeight: 800,
                  fontSize: 30,
                }}
              >
                henryp.me
              </div>
            </div>
            {image.stamp && (
              <div
                style={{
                  display: 'flex',
                  marginLeft: 30,
                  marginRight: 6,
                  padding: 4,
                  border: `2px solid ${INK}`,
                  background: BLUE,
                  transform: 'rotate(-4deg)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    padding: '8px 14px 6px',
                    border: `3px solid ${INK}`,
                    fontFamily: 'Poster62',
                    fontWeight: 800,
                    fontSize: 27,
                    letterSpacing: 1.5,
                    lineHeight: 1,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {image.stamp}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: 'Archivo', data: regular, weight: 400, style: 'normal' },
        { name: 'Archivo', data: semibold, weight: 600, style: 'normal' },
        ...widths.map((width, index) => ({
          name: `Poster${width}`,
          data: poster[index],
          weight: 800 as const,
          style: 'normal' as const,
        })),
      ],
    },
  )
}
