import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Case Studies - Henry Phillips | Enterprise Software Engineering Solutions',
  description: 'Real-world case studies showcasing enterprise-scale software engineering solutions, cloud migrations, and security implementations at Fortune 100 companies.',
  keywords: ['Software Engineering Case Studies', 'Cloud Migration', 'Enterprise Security', 'HashiCorp Vault', 'AWS Secrets Manager', 'Fortune 100', 'System Architecture'],
  openGraph: {
    title: 'Case Studies - Henry Phillips | Enterprise Software Engineering Solutions',
    description: 'Real-world case studies showcasing enterprise-scale software engineering solutions and cloud migrations.',
    url: 'https://henryp.me/case-studies',
  },
}

export default function CaseStudies() {
  const caseStudies = [
    {
      id: 'secrets-migration',
      title: 'Large-Scale Secrets Migration: HashiCorp Vault to AWS Secrets Manager',
      subtitle: 'Migrating 62.8K+ secrets for a Fortune 100 financial services institution',
      summary: 'Led the architecture and implementation of a secure, scalable migration system that successfully transferred over 62,000 secrets within a tight 12-month deadline.',
      tags: ['AWS', 'HashiCorp Vault', 'Lambda', 'Security', 'Migration', 'Enterprise'],
      readTime: '8 min read',
      featured: true
    }
  ]

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent leading-tight pb-2">
          Case Studies
        </h1>
        
        <div className="mb-12">
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Real-world engineering challenges and solutions from Fortune 100 environments. 
            These case studies demonstrate systematic problem-solving, architectural decision-making, 
            and measurable business impact.
          </p>
        </div>

        {/* Featured Case Studies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Featured Case Studies</h2>
          
          <div className="space-y-8">
            {caseStudies.filter(study => study.featured).map((study, index) => (
              <article key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      <Link 
                        href={`/case-studies/${study.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {study.title}
                      </Link>
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">{study.subtitle}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{study.readTime}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {study.summary}
                </p>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {study.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <Link 
                      href={`/case-studies/${study.id}`}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    >
                      <span>Read Case Study</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Why Case Studies?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🎯 Business Impact</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Each case study demonstrates measurable business outcomes and the strategic 
                thinking behind technical decisions in enterprise environments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🏗️ System Design</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Detailed exploration of architectural choices, trade-offs, and implementation 
                strategies for complex, large-scale systems.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">🔒 Security Focus</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Real-world examples of implementing security-by-design principles 
                in highly regulated Fortune 100 environments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">📈 Scale & Performance</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Solutions designed to handle enterprise scale with tens of thousands 
                of operations and mission-critical reliability requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}