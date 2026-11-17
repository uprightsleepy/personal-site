import type { Metadata } from 'next'
// Archivo is self-hosted from the npm package, including its width axis.
import '@fontsource-variable/archivo/wdth.css'
import './globals.css'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import { ThemeProvider } from '../components/theme-provider'
import StructuredData from '../components/structured-data'
import PlausibleProvider from 'next-plausible'
import { profile } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL('https://henryp.me'),
  title: {
    default: `${profile.name} - ${profile.shortRole}`,
    template: '%s | Henry Phillips'
  },
  description: profile.description,
  keywords: ['Cloud Security Engineer', 'Application Security', 'DevSecOps', 'CI/CD', 'Secrets Management', 'IAM', 'Terraform', 'AWS', 'GCP', 'Go', 'Python', 'Java'],
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
  verification: {
    // Add these when you set up verification
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <StructuredData 
          type="website"
          data={{
            name: `${profile.name} - ${profile.shortRole}`,
            description: profile.description,
            url: profile.url,
            author: { name: "Henry Phillips" }
          }}
        />
        <StructuredData 
          type="person"
          data={{
            name: "Henry Phillips",
            jobTitle: "Solutions Consultant",
            description: profile.description,
            url: profile.url,
            image: "https://henryp.me/headshot.jpg",
            sameAs: [profile.linkedin, profile.github],
            worksFor: {
              name: "Google",
              url: "https://www.google.com"
            },
            alumniOf: [
              {
                name: "Western Governors University",
                url: "https://wgu.edu"
              },
              {
                name: "California State University, San Bernardino", 
                url: "https://csusb.edu"
              }
            ],
            skills: [
              "Cloud Security",
              "Application Security",
              "DevSecOps",
              "CI/CD Platform Engineering",
              "Secrets Management",
              "Identity and Access Management",
              "Terraform",
              "AWS",
              "Google Cloud Platform",
              "Go",
              "Python",
              "Java"
            ]
          }}
        />
      </head>
      <body>
        <PlausibleProvider domain="henryp.me" enabled={process.env.NODE_ENV === 'production'}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="sheet flex min-h-screen flex-col bg-paper text-ink">
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
            </div>
          </ThemeProvider>
        </PlausibleProvider>
      </body>
    </html>
  )
}