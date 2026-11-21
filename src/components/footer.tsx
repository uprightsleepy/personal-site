import DimensionLine from '@/components/dimension-line'
import { NorthArrow } from '@/components/drafting'
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
    <footer className="gutter pt-28 md:pt-40">
      <DimensionLine className="mb-16 md:mb-24" />
      <p className="title drawn max-w-[14em]">
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
      {/* The margin of the drawing: notes, a north arrow and a stamp */}
      <div className="mt-16 flex flex-wrap items-end justify-between gap-x-16 gap-y-12 md:mt-24">
        <div>
          <h2 className="section-heading mb-4">General notes</h2>
          <ol className="notes">
            <li>All dimensions are in pixels.</li>
            <li>Do not scale from this drawing.</li>
            <li>Verify all dimensions on site.</li>
            <li>Built to code: Go, Python, Java and Terraform.</li>
            <li>Drawn in one ink. Color by others.</li>
          </ol>
        </div>
        <NorthArrow />
        <p className="stamp mb-3 ml-auto mr-2 md:mr-6">Not for construction</p>
      </div>
      <div className="mt-16 md:mt-24">
        <TitleBlock printed={printed} revision={buildRevision()} repo={profile.repo} />
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-x-8 gap-y-1 text-base text-soft">
        <p>© {new Date().getFullYear()} Henry Phillips</p>
        <p>Built under duress.</p>
      </div>
      {/* Halftone dots gathering at the foot of the sheet (see .halftone-fade) */}
      <div className="halftone-fade" aria-hidden="true" />
    </footer>
  )
}
