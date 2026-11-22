"use client"

import Image from 'next/image'
import { useState } from 'react'
import Poster, { type PosterLine } from '@/components/poster'

// The portrait on the About page, with a joke in it. Click it and it tells
// you off the way a locked-out terminal does in an old film. The print gives
// way to a little pixel-art Henry in his grey suit, wagging a finger, under
// the words set as a poster. Click again and the print comes back.
//
// The figure is public/magic-word.gif: Henry's own animation, printed frame
// by frame through a halftone screen like the portrait's by
// scripts/build-magic-word.py, so it is in the same one ink as the print it
// replaces. The words are set by the same poster component as the home
// page's statement.
//
// The figure only shows while the button is pressed in. Its file is not
// fetched until the portrait is first pointed at, focused or pressed. For
// anyone who asks for reduced motion, a still of its first frame is shown
// in place of the animation.

const LINE = 'Ah ah ah, you didn’t say the magic word.'

// The words as a poster. `ems` is each line's measured width at its setting;
// the poster measures again in the browser.
const words: PosterLine[] = [
  { text: 'Ah ah ah,', stretch: 125, ems: 6.7181 },
  { text: 'you didn’t say', stretch: 72, ems: 6.2589, outline: true },
  { text: 'the magic word.', stretch: 88, ems: 8.6616 },
]

export default function Portrait() {
  const [on, setOn] = useState(false)
  // Which picture of the figure to fetch, once it is wanted at all.
  const [figure, setFigure] = useState<string | null>(null)
  const want = () => {
    if (figure) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setFigure(still ? '/magic-word-still.png' : '/magic-word.gif')
  }

  return (
    <button
      type="button"
      className="wag one-ink aspect-[4/5]"
      aria-pressed={on}
      aria-label="Portrait of Henry Phillips. Press it and it objects."
      onPointerEnter={want}
      onFocus={want}
      onClick={() => {
        want()
        setOn((now) => !now)
      }}
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
        <span className="wag-words">
          <Poster label="" lines={words} />
        </span>
        {figure && (
          <Image className="wag-figure" src={figure} alt="" width={310} height={501} unoptimized />
        )}
      </span>

      {/* What the poster says, for a screen reader, when it is on */}
      <span className="sr-only" aria-live="polite">
        {on ? LINE : ''}
      </span>
    </button>
  )
}
