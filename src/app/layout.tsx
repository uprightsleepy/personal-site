import type { Metadata, Viewport } from 'next'
// Archivo is self-hosted from the npm package, including its width axis.
import '@fontsource-variable/archivo/wdth.css'
import './globals.css'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import SheetFrame from '../components/sheet-frame'
import { ThemeProvider } from '../components/theme-provider'
import StructuredData from '../components/structured-data'
import PlausibleProvider from 'next-plausible'
import { profile } from '@/lib/site'
import { person, website } from '@/lib/schema'

export const metadata: Metadata = {
  metadataBase: new URL('https://henryp.me'),
  title: {
    default: `${profile.name} - ${profile.shortRole}`,
    template: '%s | Henry Phillips'
  },
  description: profile.description,
  keywords: ['Cloud Security Engineer', 'DevSecOps Engineer', 'Application Security', 'DevSecOps', 'CI/CD', 'Secrets Management', 'IAM', 'Terraform', 'AWS', 'GCP', 'Go', 'Python', 'Java'],
  authors: [{ name: 'Henry Phillips' }],
  creator: 'Henry Phillips',
  publisher: 'Henry Phillips',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://henryp.me',
    siteName: 'Henry Phillips',
    title: `${profile.name} - ${profile.shortRole}`,
    description: profile.description,
    images: [
      {
        url: '/headshot.jpg',
        width: 1200,
        height: 630,
        alt: 'Henry Phillips',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} - ${profile.shortRole}`,
    description: profile.description,
    images: ['/headshot.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Browser chrome matches the blueprint sheet.
export const viewport: Viewport = {
  themeColor: '#1b22d2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Who the site is by and what it is, for crawlers (src/lib/schema.ts) */}
        <StructuredData data={[website, person]} />
      </head>
      <body>
        <PlausibleProvider domain="henryp.me" enabled={process.env.NODE_ENV === 'production'}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* tabIndex: the north arrow moves focus here when it brings the page back to the top */}
            <div id="top" tabIndex={-1} className="sheet flex min-h-screen flex-col bg-paper text-ink">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
              >
                Skip to main content
              </a>
              <Navigation />
              <main className="flex-1" id="main-content">
                {children}
              </main>
              <Footer />
              <SheetFrame />
              {/* Print grain over the whole sheet (see .grain in globals.css) */}
              <div className="grain" aria-hidden="true" />
              {/*
                Worn ink for the rubber stamps (see .stamp): one pair of steps
                wobbles the edges and the next knocks out specks where the
                stamp did not take.
              */}
              <svg className="sr-only" aria-hidden="true" focusable="false">
                <filter id="worn-ink" x="-10%" y="-20%" width="120%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="warp" />
                  <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" result="warped" />
                  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="11" result="speck" />
                  <feColorMatrix in="speck" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1.4" result="holes" />
                  <feComposite in="warped" in2="holes" operator="in" />
                </filter>
                {/* A slight wobble for outlined type, so it reads as drawn by hand */}
                <filter id="hand-drawn" x="-2%" y="-10%" width="104%" height="120%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="1" seed="7" result="warp" />
                  <feDisplacementMap in="SourceGraphic" in2="warp" scale="2" />
                </filter>
              </svg>
            </div>
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}