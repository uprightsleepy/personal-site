import Link from 'next/link'
import { Leader, SheetRef } from '@/components/drafting'
import StructuredData from '@/components/structured-data'
import { breadcrumbs, caseStudy } from '@/lib/schema'

// A case study of one of the personal projects, laid out like the client
// case studies under /case-studies. The two project pages (Spawnpointed and
// Badger Politics) supply the words; this draws them.
//
// Everything a page says here comes from that project's own repository and
// documents. Nothing is added that the code does not do.

export type StudySection = {
  heading: string
  paragraphs?: string[]
  // A two-column table: term on the left, detail on the right.
  rows?: [string, string][]
  list?: string[]
}

export type Study = {
  path: string
  name: string
  title: string
  lead: string
  intro: string
  description: string
  image: string
  published: string
  modified: string
  about: string[]
  facts: [string, string][]
  site: { href: string; label: string }
  source?: { href: string; label: string }
  sections: StudySection[]
}

// A two-column table row: term on the left, detail on the right.
function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-12">
      <dt className="font-semibold md:col-span-4">{term}</dt>
      <dd className="md:col-span-8">{children}</dd>
    </div>
  )
}

function Outside({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <Leader />
    </>
  )
}

export default function ProjectStudy({ study }: { study: Study }) {
  return (
    <article className="gutter">
      <StructuredData
        data={[
          caseStudy({
            path: study.path,
            headline: study.title,
            description: study.description,
            image: study.image,
            published: study.published,
            modified: study.modified,
            about: study.about,
          }),
          breadcrumbs([
            ['Home', ''],
            ['Projects', '/projects'],
            [study.name, study.path],
          ]),
        ]}
      />
      <header className="relative pb-14 pt-10 md:pb-20 md:pt-20">
        <p className="mb-8">
          <Link href="/projects">Back to projects</Link>
          <SheetRef path="/projects" />
        </p>
        <h1 className="title max-w-[12em]">{study.title}</h1>
        <p className="lead mt-8 max-w-[40ch] text-soft">{study.lead}</p>
        <p className="mt-6 max-w-[58ch]">{study.intro}</p>
        {/* Still being built: a drawing that is not finished is stamped so */}
        <p className="stamp mt-10 lg:absolute lg:bottom-28 lg:right-[9%] lg:mt-0">In progress</p>
        <dl className="mt-12 max-w-[68ch] border-b border-rule">
          {study.facts.map(([term, detail]) => (
            <Row key={term} term={term}>
              {detail}
            </Row>
          ))}
          <Row term="Site">
            <Outside href={study.site.href}>{study.site.label}</Outside>
          </Row>
          {study.source && (
            <Row term="Source">
              <Outside href={study.source.href}>{study.source.label}</Outside>
            </Row>
          )}
        </dl>
      </header>

      <div className="longform">
        {study.sections.map((section, index) => (
          <section key={section.heading}>
            <h2 className={index === 0 ? '!mt-0' : undefined}>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.rows && (
              <dl className="border-b border-rule">
                {section.rows.map(([term, detail]) => (
                  <Row key={term} term={term}>
                    {detail}
                  </Row>
                ))}
              </dl>
            )}
            {section.list && (
              <ul>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="mt-12">
          <Link href="/projects">Back to projects</Link>
        </p>
      </div>
    </article>
  )
}
