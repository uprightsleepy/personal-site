import DimensionLine from '@/components/dimension-line'
import { NorthArrow, Tie, Typed } from '@/components/drafting'
import Reveal from '@/components/reveal'
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
      {/*
        Everything down to the stamp is drawn the first time it is scrolled
        to: the dimension line is drawn out, the sentence is plotted and its
        links inked in, the notes are lettered, the north arrow settles, and
        the stamp comes down last (see "Footer reveal" in globals.css). There
        are three groups, each waiting until it is on screen itself, because
        on a phone they are more than a screen apart.
      */}
      <Reveal className="footer-reveal">
        <DimensionLine className="mb-16 md:mb-24" />
        <p className="title drawn max-w-[14em]">
          Find me on{' '}
          {/* Each link has something that happens under it on hover: see .hung */}
          <span className="hung">
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Tie />
          </span>{' '}
          and{' '}
          <span className="hung">
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Typed text={`$ gh repo clone ${profile.repo.replace('https://github.com/', '')}`} />
          </span>
          .
        </p>
      </Reveal>
      {/* The margin of the drawing: notes, a north arrow and a stamp */}
      <Reveal className="footer-reveal mt-16 flex flex-wrap items-end justify-between gap-x-16 gap-y-12 md:mt-24">
        <div>
          <h2 className="section-heading mb-4">General notes</h2>
          <ol className="notes">
            <li>All dimensions are in pixels. The line above measures itself.</li>
            <li>Built to code: Go, Python, Java and Terraform.</li>
            <li>Every revision is checked by CodeQL before issue.</li>
            <li>Drawn in one ink and set in one typeface.</li>
            <li>Do not tear the corner of sheet 1.</li>
          </ol>
        </div>
        <NorthArrow />
        <Reveal className="stamp-reveal mb-3 ml-auto mr-2 md:mr-6">
          <p className="stamp">Not for construction</p>
        </Reveal>
      </Reveal>
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
