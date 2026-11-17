import TitleBlock from '@/components/title-block'
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
      <div className="mt-16 md:mt-24">
        <TitleBlock printed={printed} />
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-x-8 gap-y-1 text-base text-soft">
        <p>© {new Date().getFullYear()} Henry Phillips</p>
        <p>Built under duress.</p>
      </div>
    </footer>
  )
}
