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

// The LinkedIn link in the footer gets a necktie on hover, and the word is
// the neck. A band of tie goes round the middle of the word and is pulled
// tight, the letters pinch in at the waist (see Neck below), and the knot and
// blade hang underneath. At rest none of it shows. The drawing is 0.5em wide
// in the word's own type size, so 100 units here is 1em: the capitals run
// from about 10 to 79, and the band is drawn tight and loosened by the
// stylesheet (see .tie in globals.css).
export function Tie() {
  return (
    <svg className="tie" viewBox="0 0 50 170" aria-hidden="true" focusable="false">
      {/* The band round the word. Paper inside, so it shows against the letters. */}
      <rect className="tie-band" x="19.5" y="20" width="11" height="49" rx="5.5" />
      <g className="tie-hang">
        {/* The blade: left half inked, right half outline, like the north arrow */}
        <g className="tie-blade">
          <path className="tie-paper" d="M25 79H29L35.5 146L25 162Z" />
          <path className="tie-fill" d="M25 79H21L14.5 146L25 162Z" />
        </g>
        <path className="tie-fill" d="M17.2 65.5H32.8L29.4 80H20.6Z" />
      </g>
    </svg>
  )
}

// A word whose letters can pinch in at the middle, for the tie above. Each
// letter carries how far it is squeezed: the middle ones most, the ends not
// at all. The letters are hidden from screen readers; the caller supplies
// the text.
export function Neck({ text }: { text: string }) {
  const letters = Array.from(text)
  const middle = (letters.length - 1) / 2
  return (
    <span aria-hidden="true">
      {letters.map((letter, index) => {
        const away = Math.abs(index - middle) / middle
        const squeeze = 1 - 0.42 * Math.exp(-Math.pow(away / 0.42, 2))
        return (
          <span key={index} className="neck-letter" style={{ '--squeeze': squeeze.toFixed(3) } as React.CSSProperties}>
            {letter}
          </span>
        )
      })}
    </span>
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

