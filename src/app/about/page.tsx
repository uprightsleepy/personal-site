import type { Metadata } from 'next'
import Portrait from '@/components/portrait'
import StructuredData from '@/components/structured-data'
import UsersLine from '@/components/users-line'
import { breadcrumbs, profilePage } from '@/lib/schema'
import { certifications, education, experience, profile, skills } from '@/lib/site'

const title = `About ${profile.name} | Software & Security Engineer`
const description =
  'Henry Phillips is a software and security engineer in the Greater Milwaukee area. Experience at Google (Wiz), RiscPoint, RKON, ScaleSec and Northwestern Mutual.'

export const metadata: Metadata = {
  // The whole title, so a search result names the role as well as the page.
  title: { absolute: title },
  description,
  alternates: { canonical: '/about' },
  keywords: [
    'Henry Phillips',
    'Software Engineer',
    'Security Engineer',
    'Platform Engineer',
    'Cloud Security Engineer',
    'DevSecOps Engineer',
    'Greater Milwaukee',
    'Platform Engineering',
    'Distributed Systems',
    'Security Automation',
  ],
  openGraph: {
    title,
    description,
    url: `${profile.url}/about`,
    images: [
      {
        url: '/og/about.png',
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
    images: ['/og/about.png'],
  },
}

export default function About() {
  return (
    <div className="gutter">
      <StructuredData data={[profilePage, breadcrumbs([['Home', ''], ['About', '/about']])]} />
      {/* Story on the left, portrait on the right */}
      <section className="grid gap-x-10 gap-y-12 pb-20 pt-10 md:grid-cols-12 md:pb-32 md:pt-20">
        <div className="md:col-span-7">
          <h1 className="title">About</h1>
          <p className="lead mt-8 max-w-[40ch]">
            I&apos;m a software and security engineer based in the Milwaukee area.
          </p>
          {/* The facts a recruiter looks for first */}
          <dl className="mt-8 max-w-[58ch] border-b border-rule">
            {[
              ['Focus', profile.focus],
              ['Location', profile.location],
            ].map(([term, detail]) => (
              <div key={term} className="grid gap-x-10 gap-y-1 border-t border-rule py-3 md:grid-cols-12">
                <dt className="font-semibold md:col-span-4">{term}</dt>
                <dd className="md:col-span-8">{detail}</dd>
              </div>
            ))}
            <div className="grid gap-x-10 gap-y-1 border-t border-rule py-3 md:grid-cols-12">
              <dt className="font-semibold md:col-span-4">Résumé</dt>
              <dd className="md:col-span-8">
                {profile.resume ? (
                  <a href={profile.resume} download>
                    Download the PDF
                  </a>
                ) : (
                  // A placeholder until the file is added (see profile.resume)
                  <span className="text-soft">PDF to follow</span>
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-8 max-w-[58ch] space-y-5">
            <p>
              I have experience building enterprise cloud infrastructure, distributed systems,
              developer platforms, and security automation.
            </p>
            <p>
              My background spans traditional software engineering, cloud security, and platform
              engineering. I&apos;ve developed production Java applications, built event-driven Go
              services for large-scale secrets migrations, and designed secure CI/CD platforms
              supporting enterprise engineering teams.
            </p>
            <p>
              My current role at Google (Wiz) has broadened my understanding of how organizations
              design, operate, and secure complex cloud environments across AWS, Google Cloud, and
              Azure.
            </p>
            <p>
              Outside of work, I build and maintain independent software projects, including
              Spawnpointed, an interactive video game geolocation platform, and Badger Politics, a
              civic information platform focused on Wisconsin.
            </p>
            <p>
              I&apos;m particularly interested in building secure, reliable systems, improving
              developer experience, and solving complex problems through software and automation.
            </p>
            <UsersLine />
          </div>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          {/* The four <i> elements are crop marks (see .crop in globals.css) */}
          <div className="crop w-full max-w-sm md:max-w-none">
            <Portrait />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </div>
          <p className="caption">
            Fig. 1. Henry Phillips, printed in one ink through a halftone screen. Not to scale.
          </p>
        </div>
      </section>

      {/* Experience */}
      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="section-heading mb-5">
          Experience
        </h2>
        <ul className="border-b border-rule">
          {experience.map((role) => (
            <li
              key={`${role.company}-${role.title}`}
              className="grid gap-x-10 gap-y-4 border-t border-rule py-8 md:grid-cols-12 md:py-10"
            >
              <div className="md:col-span-6">
                <h3 className="entry">{role.title}</h3>
                <p className="mt-3 font-semibold">{role.company}</p>
                <p className="text-soft">
                  {role.period}, {role.location}
                </p>
                {role.companyNote && <p className="text-soft">{role.companyNote}</p>}
              </div>
              <ul className="max-w-[62ch] list-disc space-y-3 pl-5 md:col-span-6">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[62ch] text-soft">
          Before software, I worked as a graphic designer at Beaver Freight Inc. from August 2021
          to May 2022, covering packaging, branding and product photography.
        </p>
      </section>

      {/* Skills, certifications and education share one table */}
      <section className="pt-24 md:pt-36" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="section-heading mb-5">
          Skills
        </h2>
        <dl className="border-b border-rule">
          {skills.map((group) => (
            <div
              key={group.group}
              className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-12"
            >
              <dt className="font-semibold md:col-span-6">{group.group}</dt>
              <dd className="max-w-[62ch] md:col-span-6">{group.items.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="pt-24 md:pt-36" aria-labelledby="credentials-heading">
        <h2 id="credentials-heading" className="section-heading mb-5">
          Certifications and education
        </h2>
        <ul className="border-b border-rule">
          {certifications.map((cert) => (
            <li key={cert} className="border-t border-rule py-4 font-semibold">
              {cert}
            </li>
          ))}
          {education.map((item) => (
            <li
              key={item.degree}
              className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-12"
            >
              <p className="font-semibold md:col-span-6">{item.degree}</p>
              <p className="md:col-span-4">{item.school}</p>
              <p className="tabular-nums text-soft md:col-span-2 md:text-right">{item.year}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
