import type { Metadata } from 'next'
import WorkCard from '@/components/work-card'
import { profile, work } from '@/lib/site'

const title = `Case Studies - ${profile.name}`
const description =
  'Work by Henry Phillips: a 62,800+ secret migration from HashiCorp Vault to AWS Secrets Manager, a multi-tenant CI/CD platform on GCP, and two personal projects.'

export const metadata: Metadata = {
  title: 'Case Studies',
  description,
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

const sectionHeading = 'mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100'

export default function CaseStudies() {
  const caseStudies = work.filter((item) => item.kind === 'Case study')
  const otherWork = work.filter((item) => item.kind !== 'Case study')

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl">
        <h1 className="mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text pb-2 text-5xl font-bold leading-tight text-transparent">
          Case Studies
        </h1>
        <p className="mb-16 max-w-3xl text-xl leading-relaxed text-gray-700 dark:text-gray-300">
          Client work from my time at ScaleSec and RKON, and two projects I build and run myself.
          The case study has a full write-up of the design, the security model and the results.
        </p>

        <section className="mb-16" aria-labelledby="case-studies-heading">
          <h2 id="case-studies-heading" className={sectionHeading}>
            Case study
          </h2>
          <div className="space-y-6">
            {caseStudies.map((item) => (
              <WorkCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="other-work-heading">
          <h2 id="other-work-heading" className={sectionHeading}>
            Other work
          </h2>
          <div className="space-y-6">
            {otherWork.map((item) => (
              <WorkCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
