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

const sectionHeading = 'mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl">
        <h1 className="mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text pb-2 text-5xl font-bold leading-tight text-transparent">
          About
        </h1>

        {/* Introduction: story on the left, photo on the right */}
        <section className="mb-16 grid items-start gap-8 md:grid-cols-3">
          <div className="space-y-6 text-xl leading-relaxed text-gray-700 dark:text-gray-300 md:col-span-2">
            <p>
              I&apos;m an application and cloud security engineer with a software engineering
              background. I work on DevSecOps, CI/CD platform engineering, IAM and secrets
              management across AWS and GCP, and I write Go, Python, Java and Terraform.
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
          <div className="flex justify-center md:justify-end">
            <div className="h-48 w-48 overflow-hidden rounded-full border-2 border-gray-200 shadow-lg dark:border-gray-700">
              <Image
                src="/headshot.jpg"
                alt="Headshot of Henry Phillips"
                width={192}
                height={192}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className={sectionHeading}>
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((role) => (
              <article
                key={`${role.company}-${role.title}`}
                className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {role.title}
                    </h3>
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                      {role.company}
                    </p>
                    {role.companyNote && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {role.companyNote}
                      </p>
                    )}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 md:text-right">
                    <p className="font-medium">{role.period}</p>
                    <p className="text-sm">{role.location}</p>
                  </div>
                </div>
                <ul className="list-disc space-y-3 pl-5 text-gray-700 marker:text-gray-400 dark:text-gray-300">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400">
            Before software, I worked as a graphic designer at Beaver Freight Inc. from August 2021
            to May 2022, covering packaging, branding and product photography.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-16" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className={sectionHeading}>
            Technical skills
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {skills.map((group) => (
              <div key={group.group}>
                <h3 className="mb-4 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                  {group.group}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications and education */}
        <section className="grid gap-12 md:grid-cols-2" aria-label="Certifications and education">
          <div>
            <h2 className={sectionHeading}>Certifications</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {certifications.map((cert) => (
                <li key={cert}>{cert}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={sectionHeading}>Education</h2>
            <ul className="space-y-5">
              {education.map((item) => (
                <li key={item.degree}>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{item.degree}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.school}, {item.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
