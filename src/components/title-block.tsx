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
// was printed in and when. `printed` is the build date, so it changes with
// every deploy.
export default function TitleBlock({ printed }: { printed: string }) {
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
          {/* The Blueprint theme prints white on blue */}
          <span className="dark:hidden">One, blue</span>
          <span className="hidden dark:inline">One, white</span>
          <span className="tint-strip" aria-hidden="true">
            <span />
            <span style={{ opacity: 0.75 }} />
            <span style={{ opacity: 0.5 }} />
            <span style={{ opacity: 0.25 }} />
          </span>
        </dd>
      </div>
      <div className="col-span-2 lg:col-span-1">
        <dt>Last printed</dt>
        <dd className="tabular-nums">{printed}</dd>
      </div>
    </dl>
  )
}
