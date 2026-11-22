"use client"

import Image from 'next/image'
import { useState } from 'react'

// The portrait on the About page, with a joke in it. Touch it and it tells
// you off the way a locked-out terminal does in an old film: the print
// rocks from side to side, a hand comes up wagging a finger, and a line of
// words runs along the bottom. It is this site's own drawing of that gag,
// in the print's one ink, with Henry's portrait in the leading role.
//
// It plays while a mouse is over the portrait or the keyboard is on it, and
// a click or a tap turns it on and off. It moves in two poses, like a short
// loop of film (see ".wag" in globals.css). For anyone who asks for reduced
// motion the hand and the words appear and hold still.

// The line, once. It is repeated in the strip so it can run without a gap.
const LINE = 'Ah ah ah, you didn’t say the magic word.'

export default function Portrait() {
  const [on, setOn] = useState(false)
  return (
    <button
      type="button"
      className="wag one-ink aspect-[4/5]"
      aria-pressed={on}
      aria-label="Portrait of Henry Phillips. Press it and it objects."
      onClick={() => setOn((now) => !now)}
    >
      {/* A halftone of headshot.jpg, built by scripts/build-print-assets.py */}
      <Image
        src="/headshot-halftone.png"
        alt=""
        width={800}
        height={1000}
        className="wag-print h-full w-full object-cover"
        priority
      />
      {/* A hand with one finger up, drawn for this page */}
      <svg className="wag-hand" viewBox="0 0 120 170" aria-hidden="true" focusable="false">
        <rect x="38" y="118" width="46" height="60" />
        <rect x="34" y="12" width="22" height="70" rx="11" />
        <rect x="28" y="68" width="66" height="58" rx="14" />
        <path d="M58 74V100M70 74V100M82 76V98" />
        <path d="M30 94C16 98 18 120 38 116" />
      </svg>
      <span className="wag-line" aria-hidden="true">
        <span>
          {LINE} {LINE} {LINE} {LINE}
        </span>
      </span>
      {/* What the strip says, for a screen reader, when it is on */}
      <span className="sr-only" aria-live="polite">
        {on ? LINE : ''}
      </span>
    </button>
  )
}
