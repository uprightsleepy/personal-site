import type { Metadata } from 'next'
import { Leader, SheetRef } from '@/components/drafting'
import WorkLink from '@/components/work-link'
import { profile, work } from '@/lib/site'

const title = `Work - ${profile.name}`
const description =
  'Work by Henry Phillips: a 62,800+ secret migration from HashiCorp Vault to AWS Secrets Manager, a multi-tenant CI/CD platform on GCP, and two personal projects.'

export const metadata: Metadata = {
  title: 'Work and Case Studies',
  description,
  alternates: { canonical: '/case-studies' },
  keywords: [
    'Cloud Security Case Studies',
    'HashiCorp Vault',
    'AWS Secrets Manager',
    'CI/CD Platform',
    'DevSecOps',
    'Security Engineering',
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

export default function Work() {
  return (
    <div className="gutter">
      <header className="pb-14 pt-10 md:pb-24 md:pt-20">
        <h1 className="title">Work</h1>
        <p className="lead mt-8 max-w-[46ch] text-soft">
          Client work from my time at ScaleSec and RKON, and two projects I build and run myself.
        </p>
      </header>

      <ul className="border-b border-rule">
        {work.map((item) => (
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
    </div>
  )
}
