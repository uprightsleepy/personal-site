import { profile } from '@/lib/site'

export default function Footer() {
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
      <div className="mt-16 flex flex-wrap justify-between gap-x-8 gap-y-1 text-base text-soft md:mt-24">
        <p>© {new Date().getFullYear()} Henry Phillips</p>
        <p>Built under duress.</p>
      </div>
    </footer>
  )
}
