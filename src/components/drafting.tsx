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
// the neck. The tie hangs under the word: the knot is pulled up tight
// beneath the letters, the word is squeezed in from both sides, and the
// blade hangs down and swings. At rest none of it shows (see .tie in
// globals.css). The drawing is 0.5em wide in the word's own type size, so
// 100 units here is 1em, and the letters stand on a line at about 79. Like
// the north arrow, the blade's left half is inked in and its right half is
// outline.
export function Tie() {
  return (
    <svg className="tie" viewBox="0 0 50 172" aria-hidden="true" focusable="false">
      <g className="tie-hang">
        <g className="tie-blade">
          <path className="tie-paper" d="M25 93H29L35.5 152L25 168Z" />
          <path className="tie-fill" d="M25 93H21L14.5 152L25 168Z" />
        </g>
        <path className="tie-fill" d="M17.2 79.5H32.8L29.4 94H20.6Z" />
      </g>
    </svg>
  )
}

// The GitHub link in the footer gets a commit graph on hover, drawn under
// the word where an underline would be: a main line with a branch that forks
// off, takes two commits and merges back, ending in a ring for the latest
// commit. The stylesheet draws the lines and pops the commits on in order
// (see .commits in globals.css). The drawing is exactly as wide as the word:
// 100 units here is 1em, and "GitHub" is 2.636em wide in the footer's type.
export function CommitGraph() {
  return (
    <svg className="graph" viewBox="0 0 263.6 44" aria-hidden="true" focusable="false">
      <path className="graph-main" pathLength={1} d="M8 9H256" />
      <path className="graph-branch" pathLength={1} d="M52 9C72 9 70 35 92 35H158C180 35 178 9 198 9" />
      <circle cx="8" cy="9" r="6.5" style={{ '--at': 0 } as React.CSSProperties} />
      <circle cx="52" cy="9" r="6.5" style={{ '--at': 1 } as React.CSSProperties} />
      <circle cx="106" cy="35" r="6.5" style={{ '--at': 2.4 } as React.CSSProperties} />
      <circle cx="146" cy="35" r="6.5" style={{ '--at': 3.3 } as React.CSSProperties} />
      <circle cx="198" cy="9" r="6.5" style={{ '--at': 4.6 } as React.CSSProperties} />
      <circle className="graph-head" cx="254" cy="9" r="8" style={{ '--at': 5.8 } as React.CSSProperties} />
    </svg>
  )
}

// A command typed out at a prompt, under the commit graph. The prompt is a
// small inked block and the command is set after it, one line for each
// entry in `lines`. A line may also break after a slash, and nowhere else,
// so the whole thing always fits inside the width of the word above it.
// Each character is its own span so the stylesheet can bring them in one
// after another (see .typed in globals.css). A block cursor waits at the
// end, in the same unbreakable piece as the last word, so it is never left
// on a line of its own.
export function Typed({ prompt, lines }: { prompt: string; lines: string[] }) {
  let typed = 0
  const total = lines.reduce((sum, line) => sum + Array.from(line).length, 0)
  return (
    <span className="typed" style={{ '--count': total } as React.CSSProperties}>
      <b>{prompt}</b>
      {lines.map((line, row) => {
        // "owner/name" becomes the pieces "owner/" and "name".
        const pieces = line.split(/(?<=\/)/)
        return (
          <span key={row} className="typed-line">
            {pieces.map((piece, place) => (
              <span key={place} className="typed-piece">
                {Array.from(piece).map((character, index) => (
                  <span key={index} style={{ '--at': typed++ } as React.CSSProperties}>
                    {character}
                  </span>
                ))}
                {row === lines.length - 1 && place === pieces.length - 1 ? <i /> : null}
              </span>
            ))}
          </span>
        )
      })}
    </span>
  )
}
