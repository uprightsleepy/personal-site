import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import { ThemeProvider } from '../components/theme-provider'
import StructuredData from '../components/structured-data'
import PlausibleProvider from 'next-plausible'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Henry Phillips - Software Engineer',
    template: '%s | Henry Phillips'
  },
  description: 'Software Engineer specializing in cloud architecture, microservices, and security. Experience with Fortune 100 financial services, AWS, GCP, and enterprise systems.',
  keywords: ['Software Engineer', 'Cloud Architecture', 'AWS', 'GCP', 'Microservices', 'Security', 'Go', 'Java', 'Python', 'Enterprise Software'],
  authors: [{ name: 'Henry Phillips' }],
  creator: 'Henry Phillips',
  publisher: 'Henry Phillips',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://henryp.me',
    siteName: 'Henry Phillips',
    title: 'Henry Phillips - Software Engineer',
    description: 'Software Engineer specializing in cloud architecture, microservices, and security. Experience with Fortune 100 financial services.',
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
    title: 'Henry Phillips - Software Engineer',
    description: 'Software Engineer specializing in cloud architecture, microservices, and security.',
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <StructuredData 
          type="website"
          data={{
            name: "Henry Phillips - Software Engineer",
            description: "Software Engineer specializing in cloud architecture, microservices, and security. Experience with Fortune 100 financial services.",
            url: "https://henryp.me",
            author: { name: "Henry Phillips" }
          }}
        />
        <StructuredData 
          type="person"
          data={{
            name: "Henry Phillips",
            jobTitle: "Cloud Security Consultant",
            description: "Software Engineer specializing in cloud architecture, microservices, and security. Experience with Fortune 100 financial services.",
            url: "https://henryp.me",
            image: "https://henryp.me/headshot.jpg",
            email: "henry@henryp.me",
            sameAs: [
              "https://linkedin.com/in/henryjamesphillips",
              "https://github.com/uprightsleepy"
            ],
            worksFor: {
              name: "ScaleSec",
              url: "https://scalesec.com"
            },
            alumniOf: [
              {
                name: "Western Governor's University",
                url: "https://wgu.edu"
              },
              {
                name: "California State University, San Bernardino", 
                url: "https://csusb.edu"
              }
            ],
            skills: [
              "Go Programming",
              "Java Development", 
              "Python Programming",
              "Cloud Architecture",
              "AWS",
              "Google Cloud Platform",
              "Microservices",
              "Security Engineering",
              "Terraform",
              "Docker"
            ]
          }}
        />
      </head>
      <body className={inter.className}>
        <PlausibleProvider domain="henryp.me" enabled={process.env.NODE_ENV === 'production'}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors flex flex-col">
              <a 
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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