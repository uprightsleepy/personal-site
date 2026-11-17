"use client"

import { usePathname } from 'next/navigation'

// The pages of the site, numbered like sheets in a drawing set.
const sheets = [
  { path: '/', title: 'Home' },
  { path: '/case-studies', title: 'Work' },
  { path: '/case-studies/secrets-migration', title: 'Secrets migration' },
  { path: '/about', title: 'About' },
  { path: '/blog', title: 'Writing' },
]

// A drafting title block: who drew the sheet, which sheet this is, what it
// was printed in, which revision and when. `printed` is the build date and
// `revision` is the commit the site was built from, so both change with every
// deploy.
export default function TitleBlock({
  printed,
  revision,
  repo,
}: {
  printed: string
  revision: string | null
  repo: string
}) {
  const pathname = usePathname().replace(/\/$/, '') || '/'
  const index = sheets.findIndex((sheet) => sheet.path === pathname)
  const sheet = index === -1 ? null : sheets[index]

  return (
    <dl className="title-block">
      <div>
        <dt>Drawn by</dt>
        <dd>Henry Phillips</dd>
      </div>
      <div>
        <dt>Title</dt>
        <dd>{sheet ? sheet.title : 'Not in this set'}</dd>
      </div>
      <div>
        <dt>Sheet</dt>
        <dd className="tabular-nums">{sheet ? `${index + 1} of ${sheets.length}` : 'None'}</dd>
      </div>
      <div>
        <dt>Ink</dt>
        <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* Blueprint prints white on blue. The Paper theme prints blue on white. */}
          <span className="paper:hidden">One, white</span>
          <span className="hidden paper:inline">One, blue</span>
          <span className="tint-strip" aria-hidden="true">
            <span />
            <span style={{ opacity: 0.75 }} />
            <span style={{ opacity: 0.5 }} />
            <span style={{ opacity: 0.25 }} />
          </span>
        </dd>
      </div>
      <div>
        <dt>Revision</dt>
        <dd className="tabular-nums">
          {revision ? (
            <a href={`${repo}/commit/${revision}`} target="_blank" rel="noopener noreferrer">
              {revision.slice(0, 7)}
              <span className="sr-only"> on GitHub (opens in a new tab)</span>
            </a>
          ) : (
            'Unrecorded'
          )}
        </dd>
      </div>
      <div>
        <dt>Last printed</dt>
        <dd className="tabular-nums">{printed}</dd>
      </div>
    </dl>
  )
}
