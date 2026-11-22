import type { Metadata } from 'next'
import Image from 'next/image'
import { certifications, education, experience, profile, skills } from '@/lib/site'

const title = `About ${profile.name} - ${profile.shortRole}`
const description =
  'Henry Phillips is an application and cloud security engineer with a software engineering background. Experience at Google (Wiz), RKON, ScaleSec and Northwestern Mutual.'

export const metadata: Metadata = {
  title: 'About',
  description,
  keywords: [
    'Henry Phillips',
    'Cloud Security Engineer',
    'Application Security',
    'DevSecOps',
    'CI/CD Platform Engineering',
    'Secrets Management',
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

// What Henry does when he is not working.
const offTheClock = [
  ['Gaming', 'I play World of Warcraft and lead a raiding guild, Average Grey Parsers.'],
  [
    'Raiding',
    'We raid for Ahead of the Curve (AOTC), the achievement for defeating a raid’s final boss on Heroic difficulty while that raid is still the current one.',
  ],
]

export default function About() {
  return (
    <div className="gutter">
      {/* Story on the left, portrait on the right */}
      <section className="grid gap-x-10 gap-y-12 pb-20 pt-10 md:grid-cols-12 md:pb-32 md:pt-20">
        <div className="md:col-span-7">
          <h1 className="title">About</h1>
          <p className="lead mt-8 max-w-[40ch]">
            I&apos;m an application and cloud security engineer with a software engineering
            background.
          </p>
          <div className="mt-8 max-w-[58ch] space-y-5">
            <p>
              I work on DevSecOps, CI/CD platform engineering, IAM and secrets management across
              AWS and GCP, and I write Go, Python, Java and Terraform.
            </p>
            <p>
              I&apos;m currently a Solutions Consultant at Wiz, now part of Google, where I manage
              16 enterprise customers across AWS, GCP and Azure and advise teams from engineers to
              CISOs.
            </p>
            <p>
              I came to security through graphic design and software engineering. Design keeps me
              focused on the person using a system, and engineering showed me how systems fail in
              practice. I try to build systems that are secure by design, usable, and don&apos;t
              make other developers&apos; lives miserable.
            </p>
          </div>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          {/* The four <i> elements are crop marks (see .crop in globals.css) */}
          <div className="crop w-full max-w-sm md:max-w-none">
            <div className="one-ink aspect-[4/5] overflow-hidden">
              {/* A halftone of headshot.jpg, built by scripts/build-print-assets.py */}
              <Image
                src="/headshot-halftone.png"
                alt="Portrait of Henry Phillips, printed as a halftone"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>
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

      {/* Outside work, in the same table as the sections above */}
      <section className="pt-24 md:pt-36" aria-labelledby="off-the-clock-heading">
        <h2 id="off-the-clock-heading" className="section-heading mb-5">
          Off the clock
        </h2>
        <dl className="border-b border-rule">
          {offTheClock.map(([term, detail]) => (
            <div key={term} className="grid gap-x-10 gap-y-1 border-t border-rule py-4 md:grid-cols-12">
              <dt className="font-semibold md:col-span-6">{term}</dt>
              <dd className="max-w-[62ch] md:col-span-6">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
