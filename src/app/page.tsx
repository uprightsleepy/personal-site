import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Henry Phillips
          </h1>
          <p className="text-3xl text-gray-700 dark:text-gray-300 mb-8 font-light">Software Engineer</p>
          
          <div className="space-y-6 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            <p>
              I build software systems that scale. My background is in full-stack 
              development, distributed systems, and cloud architecture, with 
              extensive experience working with Fortune 100 financial services companies.
            </p>
            <p>
              I focus on building systems that are secure by design, perform well under load, 
              and don&apos;t make other developers&apos; lives miserable.
            </p>
          </div>
        </div>

        {/* Skills & Experience Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Technical Skills</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Languages:</span> Go, Java, Python</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Cloud:</span> AWS, GCP</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Focus:</span> Microservices, Infrastructure as Code, CI/CD</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm hover:shadow-lg dark:shadow-gray-900/20 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Experience</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Current:</span> Cloud Security Consultant at ScaleSec</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Background:</span> Fortune 100 Financial Services</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                <p className="text-gray-600 dark:text-gray-300"><span className="font-medium text-gray-900 dark:text-gray-100">Focus:</span> Enterprise Architecture & Security</p>
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
            Read Blog
          </Link>
        </div>
      </div>
    </main>
  )
}