import type { Metadata } from 'next'
import { Leader } from '@/components/drafting'
import { articles, profile } from '@/lib/site'

const title = `Writing - ${profile.name}`
const description =
  'Articles by Henry Phillips on MCP server security and open-weight models, published with ScaleSec in 2025.'

export const metadata: Metadata = {
  title: 'Writing',
  description,
  keywords: [
    'Henry Phillips',
    'Technical Writing',
    'AI Security',
    'MCP Servers',
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
    <div className="gutter">
      <header className="pb-14 pt-10 md:pb-24 md:pt-20">
        <h1 className="title">Writing</h1>
        <p className="lead mt-8 max-w-[46ch] text-soft">
          I write about AI tooling and its security. These two articles were published with
          ScaleSec in 2025.
        </p>
      </header>

      <ul className="border-b border-rule">
        {articles.map((article) => (
          <li
            key={article.url}
            className="grid gap-x-10 gap-y-5 border-t border-rule py-8 md:grid-cols-12 md:py-12"
          >
            <div className="md:col-span-6">
              <h2 className="entry">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="nav-link">
                  {article.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <Leader />
              </h2>
              <p className="mt-3 text-soft">
                {article.publisher}, {article.year}
              </p>
            </div>
            <div className="max-w-[58ch] md:col-span-6">
              <p>{article.summary}</p>
              <p className="mt-4 text-soft">{article.tags.join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
