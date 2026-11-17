import { ImageResponse } from 'next/og'

// Social preview images are rendered once at build time and exported as
// static PNGs (/og/home.png, /og/about.png, ...), so the site needs no
// server or edge function. To add an image, add an entry here and point the
// page's metadata at /og/<key>.
//
// Icons are inline SVG rather than emoji. Emoji would make the image renderer
// download artwork from a third-party CDN during every build. The path data
// is from Lucide (https://lucide.dev, ISC License); the lucide-react
// components cannot be used here because the image renderer does not support
// forwardRef components.
export const dynamic = 'force-static'
export const dynamicParams = false

type OgImage = {
  title: string
  subtitle: string
  type?: 'default' | 'case-study'
}

const images: Record<string, OgImage> = {
  'home.png': {
    title: 'Henry Phillips',
    subtitle: 'Cloud Security Consultant & Software Engineer',
  },
  'about.png': {
    title: 'About Henry Phillips',
    subtitle: 'From Design to Software Engineering',
  },
  'blog.png': {
    title: 'Technical Writing',
    subtitle: 'Cloud Security & Software Engineering Insights',
  },
  'case-studies.png': {
    title: 'Case Studies',
    subtitle: 'Real-world Cloud Security Solutions',
  },
  'secrets-migration.png': {
    title: 'Secrets Migration Case Study',
    subtitle: '68,000+ Secrets Migrated',
    type: 'case-study',
  },
}

const iconPaths = {
  lock: [
    <rect key="body" width="18" height="11" x="3" y="11" rx="2" ry="2" />,
    <path key="shackle" d="M7 11V7a5 5 0 0 1 10 0v4" />,
  ],
  zap: [
    <path
      key="bolt"
      d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
    />,
  ],
  shield: [
    <path
      key="shield"
      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    />,
  ],
  laptop: [
    <path
      key="screen"
      d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"
    />,
    <path key="hinge" d="M20.054 15.987H3.946" />,
  ],
}

function Icon({
  name,
  size,
  color,
}: {
  name: keyof typeof iconPaths
  size: number
  color: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  )
}

export function generateStaticParams() {
  return Object.keys(images).map((slug) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const image = images[slug]
    if (!image) {
      return new Response('Not found', { status: 404 })
    }
    const { title, subtitle, type = 'default' } = image
    
    // Define colors based on your site's theme
    const gradientFrom = '#3B82F6' // blue-500
    const gradientVia = '#8B5CF6' // purple-500  
    const gradientTo = '#06B6D4' // cyan-500
    
    return new ImageResponse(
      (
        <div
          style={{
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientVia} 50%, ${gradientTo} 100%)`,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Inter", sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative background elements */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '300px',
              height: '300px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              right: '-150px',
              width: '400px',
              height: '400px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '50%',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50px',
              right: '100px',
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              display: 'flex',
            }}
          />
          
          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 10,
              padding: '80px 60px',
              maxWidth: '1000px',
            }}
          >
            {/* Security icon for case studies */}
            {type === 'case-study' && (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '40px',
                }}
              >
                <Icon name="lock" size={40} color="#3B82F6" />
              </div>
            )}
            
            {/* Title */}
            <div
              style={{
                fontSize: type === 'case-study' ? '52px' : '72px',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '24px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                textAlign: 'center',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>
            
            {/* Subtitle */}
            <div
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 300,
                lineHeight: 1.3,
                marginBottom: type === 'case-study' ? '40px' : '20px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                textAlign: 'center',
                maxWidth: '800px',
              }}
            >
              {subtitle}
            </div>
            
            {/* Accent line */}
            <div
              style={{
                width: '120px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '2px',
                display: 'flex',
                marginBottom: type === 'case-study' ? '30px' : '0px',
              }}
            />
            
            {/* Case study tags */}
            {type === 'case-study' && (
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '25px',
                    padding: '12px 24px',
                    fontSize: '18px',
                    color: 'white',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Icon name="zap" size={20} color="white" />
                  <span>Production Scale</span>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '25px',
                    padding: '12px 24px',
                    fontSize: '18px',
                    color: 'white',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Icon name="shield" size={20} color="white" />
                  <span>Security First</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Bottom branding with better styling */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '25px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Icon name="laptop" size={20} color="white" />
            <span>henryp.me</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    console.log(`${errorMessage}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}