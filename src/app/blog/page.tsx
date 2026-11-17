import type { Metadata } from 'next'
import { articles, profile } from '@/lib/site'

const title = `Writing - ${profile.name}`
const description =
  'Articles by Henry Phillips on agentic AI, MCP server security and open-weight models, published with ScaleSec in 2025.'

export const metadata: Metadata = {
  title: 'Writing',
  description,
  keywords: [
    'Henry Phillips',
    'Technical Writing',
    'AI Security',
    'MCP Servers',
    'Agentic AI',
    'Open-Weight Models',
  ],
  openGraph: {
    title,
    description,
    url: `${profile.url}/blog`,
    images: [
      {
        url: '/og/blog.png',
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/blog.png'],
  },
}

export default function Blog() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text pb-2 text-5xl font-bold leading-tight text-transparent">
          Writing
        </h1>
        <p className="mb-12 max-w-3xl text-xl leading-relaxed text-gray-700 dark:text-gray-300">
          I write about AI tooling and its security. These three articles were published with
          ScaleSec in 2025.
        </p>

        <div className="space-y-8">
          {articles.map((article) => (
            <article
              key={article.url}
              className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="mb-3 text-sm font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {article.publisher} <span aria-hidden="true">/</span> {article.year}
              </p>
              <h2 className="mb-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:hover:text-blue-400 dark:focus:ring-offset-gray-800"
                >
                  {article.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </h2>
              <p className="mb-5 leading-relaxed text-gray-700 dark:text-gray-300">
                {article.summary}
              </p>
              <ul className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
