import type { Metadata } from 'next'
import Link from 'next/link'
import { Leader, SheetRef } from '@/components/drafting'
import WorkLink from '@/components/work-link'
import { profile, work } from '@/lib/site'

const title = `Engineering Case Studies | ${profile.name}`
const description =
  'Engineering case studies by Henry Phillips: an event-driven Go platform that migrated 62,800+ secrets to AWS Secrets Manager, and a secure multi-tenant CI/CD platform on GCP.'

export const metadata: Metadata = {
  title: 'Engineering Case Studies',
  description,
  alternates: { canonical: '/case-studies' },
  keywords: [
    'Engineering Case Studies',
    'Platform Engineering',
    'Security Engineering',
    'Software Supply Chain Security',
    'CI/CD Platform',
    'HashiCorp Vault',
    'AWS Secrets Manager',
  ],
  openGraph: {
    title,
    description,
    url: `${profile.url}/case-studies`,
    images: [
      {
        url: '/og/case-studies.png',
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
    images: ['/og/case-studies.png'],
  },
}

// Client work only. The personal projects have their own page, /projects.
const caseStudies = work.filter((item) => item.kind === 'Case study')

export default function Work() {
  return (
    <div className="gutter">
      <header className="pb-14 pt-10 md:pb-24 md:pt-20">
        <h1 className="title">Work</h1>
        <p className="lead mt-8 max-w-[46ch] text-soft">
          Systems I designed and built for enterprise clients at ScaleSec and RKON.
        </p>
      </header>

      <ul className="border-b border-rule">
        {caseStudies.map((item) => (
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
                  <WorkLink item={item}>{item.link.label}</WorkLink>
                  {item.link.external ? <Leader /> : <SheetRef path={item.link.href} />}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-[58ch]">
        The software I build and run myself is under <Link href="/projects">Projects</Link>
        <SheetRef path="/projects" />
      </p>
    </div>
  )
}
