"use client"

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import Poster, { type PosterLine } from '@/components/poster'

// The portrait on the About page, with a joke in it. Click it and it tells
// you off the way a locked-out terminal does in an old film. The print
// lifts away, leaving the bare sheet and its grid inside the crop marks, and
// on it a little pixel-art Henry in his grey suit, wagging a finger, under
// the words set as a poster. Click again and the print comes back. A small
// tag in the corner of the print says not to click, which is the hint.
//
// The figure is Henry's own animation, printed in one ink on a clear ground
// by scripts/build-magic-word.py. There is a file for each theme, because
// the ink is white on the blueprint and blue on paper. The words are set by
// the same poster component as the home page's statement.
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
  // Which kind of picture of the figure to fetch, once it is wanted at all.
  const [kind, setKind] = useState<'webp' | 'png' | null>(null)
  const want = () => {
    if (kind) return
    setKind(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'png' : 'webp')
  }
  // Blueprint is the default theme (next-themes calls it "dark").
  const { resolvedTheme } = useTheme()
  const figure = kind && `/magic-word-${resolvedTheme === 'light' ? 'paper' : 'blueprint'}.${kind}`

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
        alt="Portrait of Henry Phillips, printed as a halftone"
        width={800}
        height={1000}
        className="wag-print h-full w-full object-cover"
        priority
      />
      {/* The hint, on a small tag in the corner of the print */}
      <span className="wag-tag" aria-hidden="true">
        Don&rsquo;t click
      </span>

      <span className="wag-scene" aria-hidden="true">
        <span className="wag-words">
          <Poster label="" lines={words} />
        </span>
        {figure && (
          <Image className="wag-figure" src={figure} alt="" width={410} height={664} unoptimized />
        )}
      </span>

      {/* What the poster says, for a screen reader, when it is on */}
      <span className="sr-only" aria-live="polite">
        {on ? LINE : ''}
      </span>
    </button>
  )
}
