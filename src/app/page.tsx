import Link from 'next/link'
import type { Metadata } from 'next'
import WorkCard from '@/components/work-card'
import { articles, certifications, experience, profile, skills, work } from '@/lib/site'

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

const sectionHeading = 'text-3xl font-bold text-gray-900 dark:text-gray-100'
const sectionLink =
  'rounded font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:text-blue-400 dark:hover:text-blue-300 dark:focus:ring-offset-gray-900'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl">
        {/* Hero: name on the left, positioning statement on the right */}
        <section className="mb-20 grid gap-8 md:grid-cols-5 md:items-end">
          <div className="md:col-span-3">
            <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text pb-2 text-6xl font-bold leading-tight text-transparent">
              {profile.name}
            </h1>
            <p className="mt-4 text-2xl font-light text-gray-700 dark:text-gray-300 md:text-3xl">
              {profile.role}
            </p>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400 md:col-span-2">
            <p>
              I build security into how software gets delivered: CI/CD platforms, secrets
              management, IAM and infrastructure as code on AWS and GCP. I write Go, Python, Java
              and Terraform.
            </p>
            <p>I&apos;m currently a Solutions Consultant at Wiz, part of Google.</p>
          </div>
        </section>

        {/* Selected work */}
        <section className="mb-20" aria-labelledby="work-heading">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="work-heading" className={sectionHeading}>
              Selected work
            </h2>
            <Link href="/case-studies" className={sectionLink}>
              All work <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="space-y-6">
            {work.map((item) => (
              <WorkCard key={item.slug} item={item} />
            ))}
          </div>
        </section>

        {/* Experience: one row per role */}
        <section className="mb-20" aria-labelledby="experience-heading">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="experience-heading" className={sectionHeading}>
              Experience
            </h2>
            <Link href="/about" className={sectionLink}>
              Full background <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="border-t border-gray-200 dark:border-gray-700">
            {experience.map((role) => (
              <li
                key={`${role.company}-${role.title}`}
                className="grid gap-x-6 gap-y-1 border-b border-gray-200 py-5 dark:border-gray-700 md:grid-cols-12"
              >
                <p className="font-semibold text-gray-900 dark:text-gray-100 md:col-span-4">
                  {role.title}
                </p>
                <div className="md:col-span-6">
                  <p className="text-gray-900 dark:text-gray-100">{role.company}</p>
                  <p className="text-gray-600 dark:text-gray-400">{role.summary}</p>
                </div>
                <p className="tabular-nums text-gray-600 dark:text-gray-400 md:col-span-2 md:text-right">
                  {role.years}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Toolkit */}
        <section className="mb-20" aria-labelledby="toolkit-heading">
          <h2 id="toolkit-heading" className={`${sectionHeading} mb-8`}>
            Toolkit
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((group) => (
              <div key={group.group}>
                <h3 className="mb-3 border-b border-gray-200 pb-2 font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">
                  {group.group}
                </h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <h3 className="mb-3 mt-10 font-semibold text-gray-900 dark:text-gray-100">
            Certifications
          </h3>
          <ul className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <li
                key={cert}
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                {cert}
              </li>
            ))}
          </ul>
        </section>

        {/* Writing */}
        <section aria-labelledby="writing-heading">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="writing-heading" className={sectionHeading}>
              Writing
            </h2>
            <Link href="/blog" className={sectionLink}>
              All writing <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ul className="border-t border-gray-200 dark:border-gray-700">
            {articles.map((article) => (
              <li
                key={article.url}
                className="grid gap-x-6 gap-y-1 border-b border-gray-200 py-5 dark:border-gray-700 md:grid-cols-12"
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded font-semibold text-gray-900 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:text-gray-100 dark:hover:text-blue-400 dark:focus:ring-offset-gray-900 md:col-span-8"
                >
                  {article.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <p className="text-gray-600 dark:text-gray-400 md:col-span-2">
                  {article.publisher}
                </p>
                <p className="tabular-nums text-gray-600 dark:text-gray-400 md:col-span-2 md:text-right">
                  {article.year}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
