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

// A necktie that hangs under the LinkedIn link in the footer. At rest it is
// not there. On hover it drops in loose and the knot is pulled up to the
// collar (see .tie in globals.css). Like the north arrow, its left half is
// inked in and its right half is outline.
export function Tie() {
  return (
    <svg className="tie" viewBox="0 0 40 72" aria-hidden="true" focusable="false">
      <path className="tie-collar" d="M5 1L20 11.5L35 1" />
      <g className="tie-hang">
        <g className="tie-blade">
          <path className="tie-fill" d="M20 18H17.4L12 55L20 67Z" />
          <path d="M20 18H22.6L28 55L20 67" />
        </g>
        <path className="tie-fill" d="M15.4 9H24.6L22.6 18.5H17.4Z" />
      </g>
    </svg>
  )
}

// A line typed out at a prompt, under the GitHub link in the footer. Each
// character is its own span so the stylesheet can bring them in one after
// another (see .typed in globals.css), and a block cursor waits at the end.
export function Typed({ text }: { text: string }) {
  const characters = Array.from(text)
  return (
    <span className="typed" aria-hidden="true" style={{ '--count': characters.length } as React.CSSProperties}>
      {characters.map((character, index) => (
        <span key={index} style={{ '--at': index } as React.CSSProperties}>
          {character}
        </span>
      ))}
      <i />
    </span>
  )
}

