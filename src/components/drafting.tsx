import { sheetNumber, sheets } from '@/lib/sheets'

// Small drafting symbols used beside links. They are decoration with a
// screen reader equivalent where they carry meaning.

// A reference bubble: on a drawing, a circled number beside a note says which
// sheet has the detail. Here it sits beside links to other pages.
export function SheetRef({ path }: { path: string }) {
  const number = sheetNumber(path)
  if (number === null) return null
  return (
    <span className="sheet-ref">
      <span aria-hidden="true">{number}</span>
      <span className="sr-only">
        {' '}
        (sheet {number} of {sheets.length})
      </span>
    </span>
  )
}

// A leader arrow, the kind that runs from a note to the thing it describes,
// marks links that leave the site. It points up and out of the sheet.
export function Leader() {
  return (
    <svg className="leader" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M1.5 14.5L9.5 6.5" fill="none" />
      <path d="M15 1L11.6 9L7 4.4Z" stroke="none" />
    </svg>
  )
}

// North arrow. Up the page is north, so it links back to the top.
export function NorthArrow() {
  return (
    <a href="#top" className="north nav-link">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <circle cx="32" cy="35" r="22" />
        {/* The needle: the left half is inked in, the right half is outline */}
        <path className="north-fill" d="M32 2L32 49L18 58Z" />
        <path d="M32 2L46 58L32 49" />
      </svg>
      <span>
        <span className="font-bold">N</span>
        <br />
        Back to top
      </span>
    </a>
  )
}
