import type { Metadata } from 'next'
import Link from 'next/link'
import { Leader, SheetRef } from '@/components/drafting'
import StructuredData from '@/components/structured-data'
import { breadcrumbs } from '@/lib/schema'
import { profile, work } from '@/lib/site'

const title = `Software Engineering Projects | ${profile.name}`
const description =
  'Software Henry Phillips builds and runs himself: Spawnpointed, a daily video game geolocation game on Cloudflare Workers, and Badger Politics, an open-source Wisconsin civic data platform.'

export const metadata: Metadata = {
  title: 'Software Engineering Projects',
  description,
  alternates: { canonical: '/projects' },
  keywords: [
    'Software Engineering Projects',
    'Spawnpointed',
    'Badger Politics',
    'Cloudflare Workers',
    'Civic Technology',
    'Full-Stack Development',
  ],
  openGraph: {
    title,
    description,
    url: `${profile.url}/projects`,
    images: [{ url: '/og/projects.png', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/projects.png'],
  },
}

// The projects are the entries in the work list that are not client work.
const projects = work.filter((item) => item.kind === 'Project')

export default function Projects() {
  return (
    <div className="gutter">
      <StructuredData data={breadcrumbs([['Home', ''], ['Projects', '/projects']])} />
      <header className="pb-14 pt-10 md:pb-24 md:pt-20">
        <h1 className="title">Projects</h1>
        <p className="lead mt-8 max-w-[46ch] text-soft">
          Software I design, build and run myself. Each has a case study of how it is put together.
        </p>
      </header>

      <ul className="border-b border-rule">
        {projects.map((item) => (
          <li
            key={item.slug}
            className="grid gap-x-10 gap-y-5 border-t border-rule py-8 md:grid-cols-12 md:py-12"
          >
            <div className="md:col-span-6">
              <h2 className="entry">{item.title}</h2>
              <p className="mt-3 text-soft">
                {item.kind}, {item.period}
              </p>
            </div>
            <div className="max-w-[58ch] md:col-span-6">
              <p>{item.summary}</p>
              <p className="mt-4 text-soft">{item.tags.join(', ')}</p>
              {item.link && (
                <p className="mt-4 font-semibold">
                  <Link href={item.link.href}>{item.link.label}</Link>
                  <SheetRef path={item.link.href} />
                </p>
              )}
              {item.site && (
                <p className="mt-2 font-semibold">
                  <a href={item.site.href} target="_blank" rel="noopener noreferrer">
                    {item.site.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <Leader />
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-[58ch]">
        The systems I built for enterprise clients are under <Link href="/case-studies">Work</Link>
        <SheetRef path="/case-studies" />
      </p>
    </div>
  )
}
