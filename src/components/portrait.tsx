"use client"

import Image from 'next/image'
import { useState } from 'react'

// The portrait on the About page, with a joke in it. Click it and it tells
// you off the way a locked-out terminal does in an old film. The print gives
// way to a little figure: Henry's head, cut from the same halftone, on a
// small body in his grey suit, one arm up and a finger wagging, with a line
// of words running along the bottom. Click again and the print comes back.
//
// The figure is this site's own drawing, in the print's one ink. The suit
// is grey the way a print makes grey, as a screen of dots.
//
// It only shows while the button is pressed in. It moves in two poses, like
// a short loop of film (see ".wag" in globals.css). For anyone who asks for
// reduced motion the figure appears and holds still.

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

      <span className="wag-scene" aria-hidden="true">
        {/* The body, on a grid where the collar is at the top and the raised
            arm reaches up and out to the right. */}
        <svg className="wag-body" viewBox="-10 -50 250 200" focusable="false">
          <defs>
            {/* Grey, as a print makes it: a screen of dots, turned 45 degrees */}
            <pattern id="wag-grey" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect className="wag-ground" width="3.6" height="3.6" />
              <circle className="wag-white" cx="1.8" cy="1.8" r="1.3" />
            </pattern>
          </defs>

          {/* The raised arm's upper half goes down first, so the jacket's
              edge covers where it joins the shoulder */}
          <path className="wag-suit" d="M150 60L172 46L216 100L192 124Z" />

          {/* Jacket, with a shirt showing between the lapels */}
          <path className="wag-suit" d="M30 152V72Q30 42 62 35L84 28L100 48L116 28L138 35Q170 42 170 72V152Z" />
          <path className="wag-shirt" d="M84 28L100 68L116 28L109 20H91Z" />
          <path className="wag-seam" d="M84 28L90 86L100 68L110 86L116 28" />
          <path className="wag-seam" d="M56 88V152" />
          <circle className="wag-button" cx="100" cy="108" r="3.5" />
          <circle className="wag-button" cx="100" cy="130" r="3.5" />

          {/* The forearm, cuff and hand wag about the elbow */}
          <g className="wag-arm">
            <rect className="wag-suit" x="186" y="44" width="30" height="82" rx="12" />
            <rect className="wag-shirt" x="186" y="32" width="30" height="16" />
            <rect className="wag-shirt" x="182" y="2" width="38" height="36" rx="12" />
            <rect className="wag-shirt" x="191" y="-38" width="16" height="50" rx="8" />
            <path className="wag-seam" d="M201 14V30M211 14V28" />
          </g>
        </svg>

        {/* The head: the same halftone, cut to an oval around the face */}
        <span className="wag-head">
          <Image src="/headshot-halftone.png" alt="" width={800} height={1000} />
        </span>
      </span>

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
