import Link from 'next/link'
import type { Metadata } from 'next'
import { Door, SheetRef } from '@/components/drafting'
import RevisionCloud from '@/components/revision-cloud'
import WorkLink from '@/components/work-link'
import { articles, certifications, experience, profile, work } from '@/lib/site'

const title = `${profile.name} - ${profile.shortRole}`

export const metadata: Metadata = {
  title,
  description: profile.description,
  openGraph: {
    title,
    description: profile.description,
    url: profile.url,
    images: [
      {
        url: '/og/home.png',
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: profile.description,
    images: ['/og/home.png'],
  },
}

export default function Home() {
  return (
    <div className="gutter">
      {/* Opening statement */}
      <section className="max-w-[46ch] pb-14 pt-10 md:pb-24 md:pt-20">
        <h1 className="lead">Henry Phillips is an application and cloud security engineer.</h1>
        <p className="lead mt-[0.6em] text-soft">
          I build security into how software gets delivered: CI/CD platforms, secrets management,
          IAM and infrastructure as code on AWS and GCP.
        </p>
      </section>

      {/* The work, set as an index in display type */}
      <section aria-labelledby="work-heading">
        <h2 id="work-heading" className="sr-only">
          Work
        </h2>
        <ul className="border-b border-rule">
          {work.map((item) => (
            <li key={item.slug} className="work-row border-t border-rule pb-8 pt-5 md:pb-10 md:pt-6">
              <h3 className="display">
                <WorkLink item={item} className="nav-link">
                  {item.slug === 'secrets-migration' ? (
                    <>
                      {/* Loads redacted, then the bar wipes away (see globals.css) */}
                      <span className="redact">Secrets</span> migration
                    </>
                  ) : (
                    item.display
                  )}
                </WorkLink>
                <span className="years">{item.years}</span>
              </h3>
              <div className="mt-5 grid gap-x-10 md:mt-6 md:grid-cols-12">
                <div className="max-w-[58ch] md:col-span-6 md:col-start-7">
                  <p>{item.summary}</p>
                  {item.link && (
                    <p className="mt-3 font-semibold">
                      <span className="underline">{item.link.label}</span>
                      {item.link.external ? <Door /> : <SheetRef path={item.link.href} />}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Who and where */}
      <section className="grid gap-x-10 gap-y-12 py-24 md:grid-cols-12 md:py-36" aria-labelledby="now-heading">
        {/* The newest part of the drawing gets a revision cloud */}
        <RevisionCloud className="md:col-span-6">
          <h2 id="now-heading" className="section-heading mb-5">
            Now
          </h2>
          <p className="lead">
            I&apos;m a Solutions Consultant at Wiz, part of Google, where I manage 16 enterprise
            customers across AWS, GCP and Azure.
          </p>
          <p className="mt-6 max-w-[58ch]">
            Before that I worked in cloud security engineering and consulting at RKON and ScaleSec,
            and I started as a software engineer at Northwestern Mutual. I came to security through
            graphic design and software engineering.{' '}
            <Link href="/about">More about me</Link>
            <SheetRef path="/about" />
          </p>
        </RevisionCloud>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="section-heading mb-5">Certifications</h2>
          <ul className="space-y-2">
            {certifications.map((cert) => (
              <li key={cert}>{cert}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Experience as a plain table */}
      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-heading mb-5">
          Experience
        </h2>
        <ul className="border-b border-rule">
          {experience.map((role) => (
            <li
              key={`${role.company}-${role.title}`}
              className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-12"
            >
              <p className="font-semibold md:col-span-6">{role.title}</p>
              <p className="md:col-span-4">{role.company}</p>
              <p className="tabular-nums text-soft md:col-span-2 md:text-right">{role.years}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Writing */}
      <section className="pt-24 md:pt-36" aria-labelledby="writing-heading">
        <h2 id="writing-heading" className="section-heading mb-5">
          Writing
        </h2>
        <ul className="border-b border-rule">
          {articles.map((article) => (
            <li
              key={article.url}
              className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-12"
            >
              <p className="font-semibold md:col-span-6">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="nav-link">
                  {article.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <Door />
              </p>
              <p className="md:col-span-4">{article.publisher}</p>
              <p className="tabular-nums text-soft md:col-span-2 md:text-right">{article.year}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
