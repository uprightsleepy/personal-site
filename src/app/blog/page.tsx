import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Technical Writing by Henry Phillips - Cloud Security & Software Engineering',
  description: 'Read technical articles by Henry Phillips on cloud security, AI infrastructure, microservices, and software engineering. Featured content from ScaleSec and personal insights.',
  keywords: ['Henry Phillips Blog', 'Technical Writing', 'Cloud Security Articles', 'AI Security', 'MCP Servers', 'Jules AI', 'Software Engineering Blog'],
  openGraph: {
    title: 'Technical Writing by Henry Phillips',
    description: 'Technical articles on cloud security, AI infrastructure, microservices, and software engineering.',
    url: 'https://henryp.me/blog',
  },
}

export default function Blog() {
  const articles = [
    {
      title: "Jules and the Rise of Agentic AI",
      summary: "A hands-on evaluation of Google's Jules, an agentic AI that autonomously writes code, runs tests, and creates pull requests. Explores real-world testing scenarios including Go unit tests and CLI tool development, examining where AI excels and where human oversight remains critical.",
      platform: "ScaleSec",
      date: "2025",
      tags: ["Agentic AI", "Software Development", "Go", "Testing", "Automation"],
      url: "https://scalesec.com/blog/jules-agentic-ai",
      featured: true
    },
    {
      title: "MCP Servers: AI's New Attack Surface",
      summary: "An exploration of Model Context Protocol servers and the security challenges they introduce as AI agents gain broader system access. Covers attack vectors, privilege escalation risks, and practical security frameworks for deployment.",
      platform: "ScaleSec",
      date: "2025",
      tags: ["AI Security", "MCP", "Enterprise", "Attack Vectors"],
      url: "https://scalesec.com/blog/mcp-server-security-best-practices",
      featured: true
    },
    {
      title: "Local Intelligence: Open-Weight Models for Enterprise",
      summary: "How open-weight models enable organizations to run AI entirely within their own infrastructure, maintaining data sovereignty while leveraging advanced capabilities. Covers deployment strategies and compliance considerations.",
      platform: "ScaleSec",
      date: "2025",
      tags: ["AI", "Privacy", "Compliance", "Infrastructure"],
      url: "https://www.linkedin.com/pulse/open-weight-ai-ready-you-scalesec-yjtzc/?trackingId=wQJABbVY7cBNs%2F9zahQC8A%3D%3D",
      featured: true
    }
  ]

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
          Writing
        </h1>
        
        <div className="mb-12">
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            I write about software engineering, cloud security, and emerging technologies. 
            My focus is on practical insights from working with enterprise systems and Fortune 100 environments.
          </p>
        </div>

        {/* Featured Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Featured Articles</h2>
          
          <div className="space-y-8">
            {articles.filter(article => article.featured).map((article, index) => (
              <article key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center space-x-2">
                      {article.platform === "ScaleSec" ? (
                        <Image 
                          src="/lock.png" 
                          alt="ScaleSec company logo" 
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                      ) : (
                        <span className="text-lg">📝</span>
                      )}
                      <span>{article.platform}</span>
                    </span>
                    <span>{article.date}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {article.summary}
                </p>
                
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                    {article.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium hover:scale-105"
                  >
                    <span>Read Article</span>
                    <span>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Coming Soon / Additional Content */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">More Writing</h2>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              I regularly publish technical insights on topics including:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🔒</span>
                  <span className="text-gray-700 dark:text-gray-300">Cloud Security Architecture</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🏗️</span>
                  <span className="text-gray-700 dark:text-gray-300">Microservices Design Patterns</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🤖</span>
                  <span className="text-gray-700 dark:text-gray-300">AI/ML Infrastructure</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">⚡</span>
                  <span className="text-gray-700 dark:text-gray-300">Performance Optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🏢</span>
                  <span className="text-gray-700 dark:text-gray-300">Enterprise Development</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🚀</span>
                  <span className="text-gray-700 dark:text-gray-300">DevOps & Automation</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
              Follow me on LinkedIn for updates when new articles are published.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}