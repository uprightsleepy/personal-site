import { ImageResponse } from '@vercel/og'
 
export const runtime = 'edge'
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract parameters
    const title = searchParams.get('title') || 'Henry Phillips'
    const subtitle = searchParams.get('subtitle') || 'Cloud Security Consultant & Software Engineer'
    const type = searchParams.get('type') || 'default'
    
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
                  fontSize: '36px',
                }}
              >
                🔒
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
                  <span>⚡</span>
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
                  <span>🛡️</span>
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
            <span>💻</span>
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