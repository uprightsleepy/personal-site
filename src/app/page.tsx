import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Henry Phillips - Cloud Security Consultant & Software Engineer',
  description: 'Cloud Security Consultant & Software Engineer specializing in secure cloud architectures. Helping organizations of all sizes build better, more secure systems.',
  openGraph: {
    title: 'Henry Phillips - Cloud Security Consultant & Software Engineer',
    description: 'Cloud Security Consultant & Software Engineer specializing in secure cloud architectures. Helping organizations of all sizes build better, more secure systems.',
    url: 'https://henryp.me',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Henry Phillips - Cloud Security Consultant & Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Henry Phillips - Cloud Security Consultant & Software Engineer',
    description: 'Cloud Security Consultant & Software Engineer specializing in secure cloud architectures. Helping organizations build better, more secure systems.',
    images: ['/og-home.jpg'],
  },
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent leading-tight pb-2">
            Henry Phillips
          </h1>
          <p className="text-3xl text-gray-700 dark:text-gray-300 mb-8 font-light">Cloud Security Consultant & Software Engineer</p>
          
          <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            <p>
              I specialize in secure cloud architectures and software engineering, helping organizations 
              of all sizes build better systems. My unique journey from graphic design to software 
              engineering brings both aesthetic sensibility and technical rigor to every solution.
            </p>
            <p>
              I focus on building systems that are secure by design, genuinely usable, 
              and don&apos;t make other developers&apos; lives miserable.
            </p>
          </div>
        </div>

        {/* Skills & Experience Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Technical Skills</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Languages:</span> Go, Java, Python</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Cloud:</span> AWS, GCP</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Focus:</span> Microservices, Infrastructure as Code, CI/CD</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Experience</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 mt-2"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Current:</span> Cloud Security Consultant at ScaleSec</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Background:</span> Design to Software Engineering</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0 mt-2"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Focus:</span> Secure, Usable Systems</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/about" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
          >
            Learn More
          </Link>
          <Link 
            href="/blog" 
            className="border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-xl hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
          >
            Read Writing
          </Link>
        </div>
      </div>
    </main>
  )
}