import TitleBlock from '@/components/title-block'
import { buildRevision } from '@/lib/build'
import { profile } from '@/lib/site'

export default function Footer() {
  // Rendered at build time, so this is the date of the last deploy.
  const printed = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Chicago',
  })

  return (
    <footer className="gutter pb-8 pt-28 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-12">
        <p className="title max-w-[14em]">
          Find me on{' '}
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>{' '}
          and{' '}
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          .
        </p>
        {/* A drafting stamp, kept out of the way of the sentence */}
        <p className="stamp mb-3 ml-auto mr-2 md:mr-6">Not for construction</p>
      </div>
      <div className="mt-16 md:mt-24">
        <TitleBlock printed={printed} revision={buildRevision()} repo={profile.repo} />
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-x-8 gap-y-1 text-base text-soft">
        <p>© {new Date().getFullYear()} Henry Phillips</p>
        <p>Built under duress.</p>
      </div>
    </footer>
  )
}
