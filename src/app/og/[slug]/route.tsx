import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

// Social preview images are rendered once at build time and exported as
// static PNGs (/og/home.png, /og/about.png, ...), so the site needs no
// server or edge function. To add an image, add an entry here and point the
// page's metadata at /og/<key>.
//
// They follow the site's one-ink identity: blue type on white, set in Archivo
// read from the installed font package, so nothing is fetched at build time.
export const dynamic = 'force-static'
export const dynamicParams = false

type OgImage = {
  title: string
  subtitle: string
}

const images: Record<string, OgImage> = {
  'home.png': {
    title: 'Henry Phillips',
    subtitle: 'Application and cloud security engineer',
  },
  'about.png': {
    title: 'About',
    subtitle: 'From graphic design to software to security',
  },
  'blog.png': {
    title: 'Writing',
    subtitle: 'AI tooling and its security',
  },
  'case-studies.png': {
    title: 'Work',
    subtitle: 'Secrets migration, CI/CD platform, Spawnpointed, Badger Politics',
  },
  'secrets-migration.png': {
    title: 'Secrets migration',
    subtitle: '62,800+ secrets, HashiCorp Vault to AWS Secrets Manager',
  },
}

const BLUE = '#1b22d2'

function loadFont(file: string) {
  return readFile(path.join(process.cwd(), 'node_modules/@fontsource/archivo/files', file))
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

  const [regular, heavy] = await Promise.all([
    loadFont('archivo-latin-400-normal.woff'),
    loadFont('archivo-latin-800-normal.woff'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          color: BLUE,
          padding: '56px 64px',
          fontFamily: 'Archivo',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 800 }}>
          {image.title === 'Henry Phillips' ? 'henryp.me' : 'Henry Phillips'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: image.title.length > 22 ? 96 : 132,
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              maxWidth: 1060,
            }}
          >
            {image.title}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 32,
              paddingTop: 24,
              borderTop: `3px solid ${BLUE}`,
              fontSize: 34,
              fontWeight: 400,
            }}
          >
            {image.subtitle}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Archivo', data: regular, weight: 400, style: 'normal' },
        { name: 'Archivo', data: heavy, weight: 800, style: 'normal' },
      ],
    },
  )
}
