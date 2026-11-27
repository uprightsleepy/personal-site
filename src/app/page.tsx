import Link from 'next/link'
import type { Metadata } from 'next'
import { Leader, SheetRef } from '@/components/drafting'
import LensTitle from '@/components/lens-title'
import Poster, { type PosterLine } from '@/components/poster'
import TornCorner from '@/components/torn-corner'
import WhiteRabbit from '@/components/white-rabbit'
import WorkScene from '@/components/work-scene'
import WorkLink from '@/components/work-link'
import { articles, certifications, experience, profile, work } from '@/lib/site'

const title = `${profile.name} | ${profile.shortRole}`

export const metadata: Metadata = {
  // The whole title, so the layout's template does not add the name again.
  title: { absolute: title },
  description: profile.siteDescription,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description: profile.siteDescription,
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
    description: profile.siteDescription,
    images: ['/og/home.png'],
  },
}

// The opening statement, one line of the poster each. Each line is set in its
// own width of Archivo and sized to fill the measure.
const statement: PosterLine[] = [
  { text: 'Henry Phillips', stretch: 100, ems: 8.6585 },
  { text: 'is a security', stretch: 84, ems: 6.4805, outline: true },
  { text: 'and platform', stretch: 100, ems: 8.252 },
  { text: 'engineer.', stretch: 125, ems: 7.2325, outline: true },
]

export default function Home() {
  return (
    <div className="gutter">
      {/* Opening statement, set as a poster */}
      <section className="pb-14 pt-6 md:pb-24 md:pt-10">
        {/* The rabbit comes up out of the hole in the P of the first line (see .rabbit-perch) */}
        <div className="rabbit-perch">
          <h1>
            <Poster
              label="Henry Phillips is a security and platform engineer."
              lines={statement}
            />
          </h1>
          <WhiteRabbit />
        </div>
        <div className="mt-10 grid gap-x-10 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-6 md:col-start-7">
            <p className="lead max-w-[40ch]">
              I build secure software, developer platforms, and cloud infrastructure. My work spans
              distributed systems, identity and access management, security automation, and
              software delivery.
            </p>
            <p className="mt-6 max-w-[58ch]">
              I enjoy solving complex engineering problems, building tools that simplify difficult
              workflows, and designing systems that are secure, reliable, and maintainable.
            </p>
            {/* Where to go from here: the work, the résumé and the code */}
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-semibold">
              <li>
                <Link href="/case-studies">Explore my work</Link>
                <SheetRef path="/case-studies" />
              </li>
              <li>
                <Link href="/projects">View engineering projects</Link>
                <SheetRef path="/projects" />
              </li>
              {profile.resume && (
                <li>
                  <a href={profile.resume} download>
                    Download résumé
                  </a>
                </li>
              )}
              <li>
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <Leader />
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* The work, set as an index in display type */}
      <section aria-labelledby="work-heading">
        <h2 id="work-heading" className="sr-only">
          Work
        </h2>
        <ul className="border-b border-rule">
          {work.map((item, row) => (
            <li key={item.slug} className="work-row border-t border-rule pb-8 pt-5 md:pb-10 md:pt-6">
              <h3 className="display">
                <WorkLink item={item} className="nav-link">
                  <span className="sr-only">{item.display}</span>
                  <LensTitle
                    text={item.display}
                    row={row}
                    redactFirstWord={item.slug === 'secrets-migration'}
                  />
                </WorkLink>
                <span className="years">{item.years}</span>
              </h3>
              <div className="mt-5 grid gap-x-10 md:mt-6 md:grid-cols-12">
                {/* A small moving drawing of the work, shown under a mouse */}
                <WorkScene slug={item.slug} />
                <div className="max-w-[58ch] md:col-span-6 md:col-start-7">
                  <p>{item.summary}</p>
                  {item.link && (
                    <p className="mt-3 font-semibold">
                      <span className="underline">{item.link.label}</span>
                      {item.link.external ? <Leader /> : <SheetRef path={item.link.href} />}
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
        {/* Boxed with ruled lines that run past the corners (see .drafted) */}
        <div className="drafted md:col-span-6">
          <h2 id="now-heading" className="section-heading mb-5">
            Now
          </h2>
          <p className="lead">
            I&apos;m a Solutions Consultant at Wiz, part of Google, where I build Terraform sandbox
            environments, customize security policies and detection rules, and write reference
            architectures across AWS, GCP and Azure.
          </p>
          <p className="mt-6 max-w-[58ch]">
            Before that I built a CI/CD platform and a secrets migration at RKON and ScaleSec, and
            I started as a software engineer at Northwestern Mutual. Outside of work I build and run Spawnpointed and Badger Politics.{' '}
            <Link href="/about">More about me</Link>
            <SheetRef path="/about" />
          </p>
        </div>
        {/* The top padding lines this heading up with "Now" inside its box */}
        <div className="md:col-span-6 md:col-start-7 md:pt-[1.6rem]">
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
                <Leader />
              </p>
              <p className="md:col-span-4">{article.publisher}</p>
              <p className="tabular-nums text-soft md:col-span-2 md:text-right">{article.year}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* A torn corner of the sheet, with something behind it */}
      <TornCorner />
    </div>
  )
}
