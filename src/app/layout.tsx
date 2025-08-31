import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import { ThemeProvider } from '../components/theme-provider'

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
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}