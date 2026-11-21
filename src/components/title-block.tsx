"use client"

import { usePathname } from 'next/navigation'
import { sheets } from '@/lib/sheets'

// A drafting title block: who drew the sheet and what checked it, which sheet
// this is, its scale, what it was printed in, which revision and when.
// `printed` is the build date and `revision` is the commit the site was built
// from, so both change with every deploy. "Checked by" names the analysis
// that runs on every pull request (.github/workflows/security-scan.yml).
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
        <dt>Checked by</dt>
        <dd>CodeQL</dd>
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
        <dt>Scale</dt>
        <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>1:1</span>
          {/* A graphic scale: four 25 pixel divisions */}
          <span className="scale-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="font-normal text-soft">100 px</span>
        </dd>
      </div>
      <div>
        <dt>Ink</dt>
        <dd className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* Blueprint prints white on blue. The Paper theme prints blue on white. */}
          <span className="paper:hidden">One, white</span>
          <span className="hidden paper:inline">One, blue</span>
          <span className="tint-strip" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
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
