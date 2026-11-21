"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './torn-corner.module.css'

// An easter egg for the home page. The bottom right corner of the sheet is
// torn a little and folded back. Drag the corner up and to the left and the
// sheet tears after it, a bit at a time, in the direction it is pulled. Tear
// far enough and the piece comes away, leaving a music video behind the hole,
// printed through a halftone screen in the sheet's one ink.
//
// The video is a short silent clip served from this site
// (public/tear-video.mp4, made by scripts/build-tear-video.sh). It behaves
// like a GIF: no sound, no controls, it loops, and it cannot be clicked. The
// halftone is done in the stylesheet, on top of the playing clip.
//
// The picture is always behind the sheet, so the folded corner gives a peek
// of it. Until the clip is needed that is a still of its first frame
// (public/tear-poster.jpg). The clip itself is fetched when the pointer
// first reaches the corner, so it is already there when the sheet starts to
// tear. Its first frame shows through the hole as it opens, and it starts to
// play when the piece comes away.
//
// Music starts with it: an 8-bit cover of the song (public/tear-audio.mp3,
// made by scripts/build-tear-audio.sh). It is fetched when the corner is
// first pressed. Once the piece is off there is a volume slider beside the
// button that tapes the sheet back. On a touch screen, where the phone has
// its own volume buttons, there is a mute button in its place. The music
// and the clip stop whenever the page is out of sight: the tab is switched
// or closed, the browser is put away, or the phone goes to sleep. The clip
// picks up again when the page is back. So does the music if the page was
// only away for a moment; after longer it waits to be turned back on.
//
// The music is played through the same Web Audio context as the tearing
// sound, with a gain on it, and the slider moves that gain. Setting the
// player's own volume is not enough: iPhones ignore it. Browsers only let a
// page start sound in answer to a press, a tap or a key, so if the music is
// refused, or the context has not been let run yet, it starts on the next
// one, and the control offers to turn it on.
//
// How the tear works. The component owns a 16:9 box pinned to the corner of
// the sheet, and everything is computed in that box's pixel coordinates.
//
//   - Each attempt has a tear line: the path the paper will split along. It
//     starts as a nick in the bottom edge, runs just inside that edge, goes
//     round an uneven outline, and comes back down just inside the right
//     edge to a nick there. `seed` gives it its shape and `lean` (the way
//     the corner is being pulled) decides how far it reaches along each
//     edge. The part that has not torn yet keeps adjusting to the pull.
//   - The line is a row of sample points, and each one holds until the pull
//     has carried the fold a certain distance past it. Most give after a
//     pixel or two. Some are knots that hold for much longer and then let
//     go of everything behind them at once. That is what makes the tear
//     stick and slip.
//   - Two tear fronts work inward from the two nicks. A point can only tear
//     once the one before it has. The white torn edge is drawn along the
//     points that have torn and nowhere else, so it grows from the edges in
//     the direction of the pull.
//   - The straight line between the two fronts is the fold. The hole is the
//     torn part of the line, the fold, and the corner of the box. The flap
//     is the hole's own shape turned over across the fold, showing the back
//     of the sheet. As the tear outruns the hand the flap is drawn shorter,
//     as if it were being lifted off the page instead of pressed flat.
//   - While the corner is being dragged a torn point stays torn. At other
//     times (hovering, settling back, taping it back) the fronts follow the
//     fold in both directions, so laying the paper down closes the tear.
const CLIP = '/tear-video.mp4'
const POSTER = '/tear-poster.jpg'
const SONG = '/tear-audio.mp3'
// Where the volume slider's position is kept between visits.
const VOLUME_KEY = 'tear-level-2'
// The slider starts low. Its position is squared to get the loudness, so
// the quiet end, where the music is most comfortable, has the most travel.
// A phone has no slider and plays at one level, lower still, because its
// speaker is close and harsh.
const QUIET = 0.28
const QUIET_ON_A_PHONE = 0.2
const loudness = (position: number) => position * position
// A page that comes back within this long picks its music up again unasked.
const A_MOMENT = 15000

type State = 'idle' | 'dragging' | 'finishing' | 'ripping' | 'open' | 'closing'
type Point = [number, number]
type Shape = {
  // Where the corner has been pulled to, as an offset from where it belongs.
  tip: Point
  // 0 to 1: carries the fold the rest of the way once the hand has let go.
  boost: number
  // 0 to 1: how much of the pull is sideways (1) as opposed to upward (0).
  lean: number
  // Picks the tear line. A new one is drawn after the sheet is taped back.
  seed: number
}
type Tear = {
  w: number
  h: number
  seed: number
  // The direction the outline was laid out for. It follows the pull while
  // the tear is young and is settled by the time a quarter of it has torn.
  lean: number
  controls: Point[]
  // How far past each sample the fold must travel before it tears.
  hold: number[]
  // The two tear fronts: samples 0..lower and upper..end have torn.
  lower: number
  upper: number
}

// Where the corner sits at rest, with the pointer over it, and when it is
// given a tug. Slightly lopsided, so it does not look ruled.
const REST: Point = [-39, -52]
const PEEK: Point = [-51, -68]
const TUG: Point = [-72, -96]
const REST_LEAN = 39 / 91
// The tear line's control points: along the bottom edge, round the outline,
// and down the right edge, plus the two nicks.
const ALONG_BOTTOM = 6
const OUTLINE = 13
const ALONG_RIGHT = 4
const CONTROLS = ALONG_BOTTOM + OUTLINE + ALONG_RIGHT
// The flap is never drawn shorter than this share of its full length.
const LIFTED = 0.3

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const mix = (from: Point, to: Point, amount: number): Point => [
  lerp(from[0], to[0], amount),
  lerp(from[1], to[1], amount),
]
const fmt = (point: Point) => `${point[0].toFixed(1)} ${point[1].toFixed(1)}`

// Repeatable noise: the same inputs always give the same value, so a tear
// keeps its shape from frame to frame, and a new seed gives a new tear.
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}
const noise = (x: number, seed: number) => {
  const i = Math.floor(x)
  const f = x - i
  const u = f * f * (3 - 2 * f)
  return lerp(hash(i + seed * 57), hash(i + 1 + seed * 57), u) * 2 - 1
}

// Small boxes (phones) get a finer tear: fewer samples and smaller features.
const scaleFor = (w: number) => clamp(w / 640, 0.55, 1)
const samplesPerSpan = (w: number) => (w < 420 ? 12 : 20)

// The control points of a tear line, from the nick in the bottom edge to
// the nick in the right edge. Going this way round, the sheet is on the left
// of the line and the hole on the right.
function tearLine(w: number, h: number, seed: number, lean: number): Point[] {
  const k = scaleFor(w)
  const sideways = clamp(lean * 2)
  const upward = clamp((1 - lean) * 2)
  const reachX = (0.52 + 0.47 * sideways) * w
  const reachY = (0.5 + 0.46 * upward) * h
  const nickX = (16 + hash(seed + 71) * 10) * k
  const nickY = (12 + hash(seed + 73) * 8) * k
  // How far inside the edge the tear runs. It wanders, and now and then it
  // all but reaches the edge.
  const inset = (j: number, salt: number) =>
    Math.max(1.2, 1.5 + (noise(j * 1.3, seed + salt) + 0.85) * 4.6) * k

  const points: Point[] = [[w - nickX, h]]
  const spanX = Math.max(40, reachX * 0.9 - nickX)
  for (let j = 1; j <= ALONG_BOTTOM; j++) {
    points.push([w - nickX - (spanX * j) / ALONG_BOTTOM, h - inset(j, 61)])
  }

  // The outline bulges away from the corner like a rounded rectangle, with
  // its own lumps and one deeper bite.
  const bite = 0.2 + hash(seed + 5) * 0.6
  for (let i = 1; i < OUTLINE + 1; i++) {
    const t = i / (OUTLINE + 1)
    const angle = (t * Math.PI) / 2
    // A squarer curve than a circle, so the opening fills its corner.
    const cx = Math.pow(Math.cos(angle), 0.62)
    const cy = Math.pow(Math.sin(angle), 0.62)
    const pinned = Math.min(1, t * 5, (1 - t) * 5)
    const lumps = noise(t * 5.3, seed + 11) * 0.11 + noise(t * 11.7, seed + 23) * 0.05
    const dent = -0.17 * Math.exp(-Math.pow((t - bite) / 0.07, 2))
    const scale = 1 + (lumps + dent) * pinned
    points.push([
      clamp(w - reachX * cx * scale, w * 0.012, w),
      clamp(h - reachY * cy * scale, h * 0.03, h),
    ])
  }

  const spanY = Math.max(30, reachY * 0.9 - nickY)
  for (let j = ALONG_RIGHT; j >= 1; j--) {
    points.push([w - inset(j, 67), h - nickY - (spanY * j) / ALONG_RIGHT])
  }
  points.push([w, h - nickY])
  return points
}

// How long each sample holds. Near the two nicks the paper is already worked
// loose and gives at once. Further in, most samples give easily and a few
// are knots.
function holds(count: number, seed: number, k: number): number[] {
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    const fromEnd = Math.min(i, count - 1 - i)
    const ramp = clamp((fromEnd - count * 0.05) / (count * 0.11))
    const knot = hash(i * 3.3 + seed + 53) > 0.84
    const tough = knot ? 7 + 22 * Math.pow(hash(i + seed + 59), 2) : 0
    out.push((1.5 + ramp * (1.5 + tough)) * k)
  }
  return out
}

// A smooth curve through the control points, `per` samples to each span.
// The tangents are scaled to each span's length, so uneven spacing does not
// make it loop. Both ends cut in from the edge instead of grazing it.
function sample(controls: Point[], per: number, w: number, h: number): Point[] {
  const last = controls.length - 1
  const tangents = controls.map((_, i): Point => {
    if (i === 0) return [-0.45, -0.89]
    if (i === last) return [0.89, 0.45]
    const from = controls[i - 1]
    const to = controls[i + 1]
    const span = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1
    return [(to[0] - from[0]) / span, (to[1] - from[1]) / span]
  })
  const curve: Point[] = []
  for (let i = 0; i < last; i++) {
    const p0 = controls[i]
    const p1 = controls[i + 1]
    const length = Math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    // The first and last spans leave the edge sharply, then settle.
    const pull0 = i === 0 ? length * 0.35 : length
    const pull1 = i === last - 1 ? length * 0.35 : length
    for (let j = i === 0 ? 0 : 1; j <= per; j++) {
      const t = j / per
      const a = 2 * t * t * t - 3 * t * t + 1
      const b = t * t * t - 2 * t * t + t
      const c = -2 * t * t * t + 3 * t * t
      const d = t * t * t - t * t
      const at = (axis: 0 | 1) =>
        a * p0[axis] + b * pull0 * tangents[i][axis] + c * p1[axis] + d * pull1 * tangents[i + 1][axis]
      curve.push([clamp(at(0), 0, w), clamp(at(1), 0, h)])
    }
  }
  return curve
}

// The music player, wired through a gain where the browser allows it.
function makePlayer(context: AudioContext | null, amount: number) {
  const song = new Audio(SONG)
  song.loop = true
  song.preload = 'auto'
  let gain: GainNode | null = null
  if (context) {
    try {
      gain = context.createGain()
      gain.gain.value = amount
      context.createMediaElementSource(song).connect(gain).connect(context.destination)
    } catch {
      // No gain: the slider falls back to the player's own volume.
      gain = null
    }
  }
  return { song, gain }
}

export default function TornCorner() {
  const box = useRef<HTMLDivElement>(null)
  const hole = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [state, setState] = useState<State>('idle')
  // The clip: whether it has been asked for, and
  // whether it is behind the hole at the moment.
  const [fetched, setFetched] = useState(false)
  const [showing, setShowing] = useState(false)
  const film = useRef<HTMLVideoElement>(null)
  // The music: the player, the gain it plays through, whether it is meant
  // to be playing, whether the browser has kept it silent, whether this is
  // a touch screen, where the volume slider is, and whether it is muted.
  const music = useRef<HTMLAudioElement | null>(null)
  const level = useRef<GainNode | null>(null)
  const wanted = useRef(false)
  const [refused, setRefused] = useState(false)
  // The page was out of sight for a while, and the music is waiting to be
  // turned back on.
  const [held, setHeld] = useState(false)
  const [touch] = useState(() => {
    try {
      return window.matchMedia('(pointer: coarse)').matches
    } catch {
      return false
    }
  })
  const [volume, setVolume] = useState(() => {
    if (touch) return QUIET_ON_A_PHONE
    try {
      const kept = Number(window.localStorage.getItem(VOLUME_KEY) ?? 'none')
      if (kept >= 0 && kept <= 1) return kept
    } catch {
      // No storage (or no window, on the server): use the default.
    }
    return QUIET
  })
  const position = useRef(volume)
  const [muted, setMuted] = useState(false)
  const silenced = useRef(false)
  const current = useRef<State>('idle')
  const shape = useRef<Shape>({ tip: REST, boost: 0, lean: REST_LEAN, seed: 1 })
  const line = useRef<Tear | null>(null)
  const tween = useRef(0)
  const timer = useRef(0)
  const audio = useRef<AudioContext | null>(null)
  const ticked = useRef(0)

  const move = useCallback((next: State) => {
    current.current = next
    setState(next)
  }, [])

  // Put the clip behind the hole, from its first frame, or take it away.
  const show = useCallback(() => {
    setFetched(true)
    setShowing(true)
  }, [])
  const hide = useCallback(() => setShowing(false), [])

  // Sound needs a Web Audio context, and a context only runs once it has been
  // asked to from inside a press, a tap or a key. This is called from all of
  // those.
  const wake = useCallback(() => {
    try {
      audio.current ??= new AudioContext()
      void audio.current.resume()
    } catch {
      audio.current = null
    }
  }, [])

  const setLoudness = useCallback((amount: number) => {
    if (level.current) level.current.gain.value = amount
    else if (music.current) music.current.volume = amount
  }, [])

  // Make the music player, in answer to a press or a key, and wire it through
  // a gain. Playing it muted for a moment here is what lets it be started
  // later, when the piece comes away, in browsers that tie sound to the
  // gesture that asked for it.
  const prime = useCallback(() => {
    wake()
    if (!music.current) {
      const made = makePlayer(audio.current, loudness(position.current))
      music.current = made.song
      level.current = made.gain
    }
    const song = music.current
    if (wanted.current || !song.paused) return
    song.muted = true
    song
      .play()
      .then(() => {
        if (wanted.current) return
        song.pause()
        song.currentTime = 0
      })
      .catch(() => {})
  }, [wake])

  // Start the music, from the top or from where it was, or stop it.
  const playMusic = useCallback((fromTheTop: boolean) => {
    prime()
    const song = music.current
    if (!song) return
    wanted.current = true
    if (fromTheTop) song.currentTime = 0
    song.muted = silenced.current
    setLoudness(loudness(position.current))
    song.play().then(
      () => {
        // The player is going, but through a gain it is only heard if the
        // context is running too. Give it a moment to start, then look.
        window.setTimeout(() => {
          if (wanted.current) setRefused(Boolean(level.current) && audio.current?.state !== 'running')
        }, 250)
      },
      () => setRefused(true),
    )
  }, [prime, setLoudness])
  const stopMusic = useCallback(() => {
    wanted.current = false
    music.current?.pause()
    setRefused(false)
    setHeld(false)
  }, [])

  // The sound of paper giving way: a short burst of filtered noise. `force`
  // runs from a faint tick to the final rip.
  const crackle = useCallback((force: number) => {
    const context = audio.current
    if (!context || context.state !== 'running') return
    const seconds = 0.025 + 0.2 * force * force
    const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * seconds), context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      // Noise that dies away, with a little grit in it.
      const fade = Math.pow(1 - i / data.length, 1.6)
      data[i] = (Math.random() * 2 - 1) * fade * (0.6 + 0.4 * Math.random())
    }
    const source = context.createBufferSource()
    source.buffer = buffer
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2600 + Math.random() * 2600
    filter.Q.value = 0.6
    const gain = context.createGain()
    gain.gain.value = 0.035 + 0.1 * force
    source.connect(filter).connect(gain).connect(context.destination)
    source.start()
  }, [])

  // Works out the tear for the current shape and draws it. Returns how far
  // the tear got on this call and whether the two fronts have met.
  const draw = useCallback((): { advanced: number; met: boolean } => {
    const el = box.current
    const root = svg.current
    const nothing = { advanced: 0, met: false }
    if (!el || !root || !hole.current) return nothing
    const w = el.offsetWidth
    const h = el.offsetHeight
    if (!w || !h) return nothing
    const { tip, boost, lean, seed } = shape.current
    const mode = current.current
    const part = (name: string) => root.querySelector<SVGElement>(`[data-part="${name}"]`)!
    const k = scaleFor(w)
    const per = samplesPerSpan(w)
    const count = (CONTROLS + 1) * per + 1

    // --- The tear line ---------------------------------------------------
    let tear = line.current
    if (!tear || tear.w !== w || tear.h !== h || tear.seed !== seed) {
      // A new line (or a resized box). If the piece is already off, it
      // stays off.
      const off = mode === 'ripping' || mode === 'open'
      const middle = Math.floor(count / 2)
      const settled = tear && tear.seed === seed ? tear.lean : lean
      tear = line.current = {
        w,
        h,
        seed,
        lean: settled,
        controls: tearLine(w, h, seed, settled),
        hold: holds(count, seed, k),
        lower: off ? middle : 0,
        upper: off ? middle + 1 : count - 1,
      }
    } else {
      // The part that has not torn follows the pull, less and less as the
      // tear gets going. Points near a tear front stay put, so the torn part
      // never changes shape.
      const torn = 1 - (tear.upper - tear.lower) / (count - 1)
      tear.lean = lerp(tear.lean, lean, clamp(1 - torn / 0.25))
      const wanted = tearLine(w, h, seed, tear.lean)
      const from = Math.floor(tear.lower / per) + 3
      const to = Math.ceil(tear.upper / per) - 3
      for (let j = from; j <= to; j++) {
        const next: Point = [wanted[j][0], wanted[j][1]]
        // Keep the runs along the edges in order as their reach changes.
        if (j >= 1 && j <= ALONG_BOTTOM) next[0] = Math.min(next[0], tear.controls[j - 1][0] - 12 * k)
        tear.controls[j] = next
      }
      for (let j = Math.min(to, CONTROLS); j >= Math.max(from, CONTROLS - ALONG_RIGHT + 1); j--) {
        tear.controls[j][1] = Math.min(tear.controls[j][1], tear.controls[j + 1][1] - 12 * k)
      }
    }
    const curve = sample(tear.controls, per, w, h)
    const end = curve.length - 1

    // --- How far the fold has been carried -------------------------------
    // Distances are measured from the corner along the direction of pull.
    const size = Math.hypot(lean, 1 - lean)
    const ux = -lean / size
    const uy = -(1 - lean) / size
    const along = curve.map((point) => (point[0] - w) * ux + (point[1] - h) * uy)
    let farthest = 0
    let all = 0
    for (let i = 0; i <= end; i++) {
      farthest = Math.max(farthest, along[i])
      all = Math.max(all, along[i] + tear.hold[i])
    }
    all += 2
    // A light pull folds the corner exactly: the fold is halfway between the
    // corner and where it has been pulled to. Past that the paper is being
    // lifted more than folded and the tear runs ahead of the hand, so that
    // it is through by the time the hand has crossed most of the opening.
    const pull = Math.hypot(tip[0], tip[1])
    const folding = 0.35 * h
    const through = Math.max(folding + 60, 0.8 * farthest)
    const gain = Math.max(0.5, (all - folding / 2) / (through - folding))
    const carried = pull <= folding ? pull / 2 : folding / 2 + (pull - folding) * gain
    const fold = lerp(carried, Math.max(carried, all), boost)

    // --- The tear fronts -------------------------------------------------
    const before = tear.lower + (end - tear.upper)
    let moved = true
    while (moved) {
      moved = false
      if (tear.lower + 1 < tear.upper && fold - along[tear.lower + 1] > tear.hold[tear.lower + 1]) {
        tear.lower++
        moved = true
      }
      if (tear.upper - 1 > tear.lower && fold - along[tear.upper - 1] > tear.hold[tear.upper - 1]) {
        tear.upper--
        moved = true
      }
    }
    if (mode === 'idle' || mode === 'closing') {
      // Not being pulled: laying the paper back down closes the tear.
      while (tear.lower > 0 && fold - along[tear.lower] <= 0) tear.lower--
      while (tear.upper < end && fold - along[tear.upper] <= 0) tear.upper++
    }
    const { lower, upper } = tear
    const advanced = Math.max(0, lower + (end - upper) - before)
    const met = upper - lower <= 1

    // --- The ragged edge -------------------------------------------------
    // Only where the sheet has torn. `centre` is the edge of the hole.
    // `sheet` and `core` are the two sides of the band of white fibre, which
    // narrows to nothing at each tear front.
    const centre: Point[] = []
    const fibres: string[] = []
    const bands: string[] = []
    const inside = (x: number, y: number): Point => [clamp(x, 0, w), clamp(y, 0, h)]
    const run = (from: number, to: number) => {
      const sheet: Point[] = []
      const core: Point[] = []
      for (let i = from; i <= to; i++) {
        const [x, y] = curve[i]
        const prev = curve[Math.max(0, i - 1)]
        const next = curve[Math.min(end, i + 1)]
        const length = Math.hypot(next[0] - prev[0], next[1] - prev[1]) || 1
        // Unit vector pointing out of the hole, into the sheet.
        const ax = (next[1] - prev[1]) / length
        const ay = -(next[0] - prev[0]) / length
        const fromEnd = Math.min(i, end - i)
        const fromFront = i <= lower ? lower - i : i - upper
        const pinned = Math.min(1, fromEnd / 4)
        const wander =
          (noise(i * 0.22, seed + 1) * 3.4 + noise(i * 0.64, seed + 2) * 1.7 + noise(i * 1.6, seed + 3) * 0.7) *
          pinned *
          k
        const taper = Math.min(clamp(fromFront / 6, 0.1, 1), 0.25 + 0.75 * clamp(fromEnd / 12)) * k
        const tuft = hash(Math.floor(i / 2.6) + seed + 9) > 0.78 ? 2.6 : 0
        const outer = (1.1 + (noise(i * 0.5, seed + 4) + 1) * 1.4) * taper
        const inner = (1.3 + (noise(i * 0.58, seed + 5) + 1) * 2.1 + tuft) * taper
        centre.push(inside(x + ax * wander, y + ay * wander))
        sheet.push(inside(x + ax * (wander + outer), y + ay * (wander + outer)))
        core.push(inside(x + ax * (wander - inner), y + ay * (wander - inner)))
        // Now and then a loose fibre hangs into the hole.
        if (i % 5 === 2 && fromFront > 3 && hash(Math.floor(i / 5) + seed + 31) > 0.45) {
          const long = (3 + hash(i * 7.3 + seed) * 7) * k
          const sway = (hash(i * 3.1 + seed + 3) - 0.5) * 5 * k
          fibres.push(
            `M${fmt([x + ax * (wander - inner + 0.5), y + ay * (wander - inner + 0.5)])}` +
              `l${(-ax * long - ay * sway).toFixed(1)} ${(-ay * long + ax * sway).toFixed(1)}`,
          )
        }
      }
      if (sheet.length > 1) {
        bands.push(`M${sheet.map(fmt).join('L')}L${[...core].reverse().map(fmt).join('L')}Z`)
      }
    }
    run(0, lower)
    const split = centre.length
    run(upper, end)

    // --- The hole --------------------------------------------------------
    // The torn edge on one side, straight across the fold, the torn edge on
    // the other side, and round the corner of the box.
    const corner: Point = [w, h]
    const outline = [...centre, corner]
    hole.current.style.clipPath = `polygon(${outline
      .map((point) => `${point[0].toFixed(1)}px ${point[1].toFixed(1)}px`)
      .join(',')})`
    part('clip').setAttribute('points', outline.map(fmt).join(' '))
    part('shade').setAttribute('d', `M${centre.map(fmt).join('L')}`)
    part('core').setAttribute('d', bands.join(''))
    part('fibres').setAttribute('d', fibres.join(''))

    // --- The flap --------------------------------------------------------
    // The same shape turned over across the fold. Once the piece comes away
    // it keeps its last shape while the stylesheet drops it.
    const attached = mode === 'idle' || mode === 'dragging' || mode === 'finishing'
    const low = centre[split - 1]
    const high = centre[split]
    const width = Math.hypot(high[0] - low[0], high[1] - low[1])
    if (attached && !met && width > 4) {
      // Unit vector across the fold, pointing toward the corner.
      let nx = (high[1] - low[1]) / width
      let ny = -(high[0] - low[0]) / width
      if (nx * (w - low[0]) + ny * (h - low[1]) < 0) {
        nx = -nx
        ny = -ny
      }
      const c = -(nx * low[0] + ny * low[1])
      const depth = Math.max(1, nx * w + ny * h + c)
      // Pressed flat, the corner lands twice as far out as the fold. When the
      // hand has not gone that far the flap is standing up off the page, and
      // from above it looks shorter.
      const reach = -(tip[0] * nx + tip[1] * ny)
      const over = 1 + clamp(reach / depth - 1, LIFTED, 1)
      const turn = (point: Point): Point => {
        const distance = Math.max(0, nx * point[0] + ny * point[1] + c)
        return [point[0] - over * distance * nx, point[1] - over * distance * ny]
      }
      const turned = outline.map(turn)
      const points = turned.map(fmt).join(' ')
      part('flap').setAttribute('points', points)
      part('flap-edge').setAttribute('points', points)
      part('flap-print').setAttribute('points', points)
      // Its torn edges show their white core too.
      part('flap-torn').setAttribute(
        'd',
        `M${centre.slice(0, split).map(turn).map(fmt).join('L')}` +
          `M${centre.slice(split).map(turn).map(fmt).join('L')}`,
      )
      // The sheet's own two edges, which carry the frame's border.
      part('flap-border').setAttribute(
        'points',
        [centre[centre.length - 1], corner, centre[0]].map(turn).map(fmt).join(' '),
      )
      // Shading runs from the crease to the tip of the corner.
      const mid = mix(low, high, 0.5)
      const length = (over - 1) * depth
      const shading = part('curl')
      shading.setAttribute('x1', mid[0].toFixed(1))
      shading.setAttribute('y1', mid[1].toFixed(1))
      shading.setAttribute('x2', (mid[0] - length * nx).toFixed(1))
      shading.setAttribute('y2', (mid[1] - length * ny).toFixed(1))
      // The back of the sheet shows its print faintly, turned over with it.
      part('print').setAttribute(
        'transform',
        `matrix(${1 - over * nx * nx} ${-over * nx * ny} ${-over * nx * ny} ${1 - over * ny * ny} ${
          -over * c * nx
        } ${-over * c * ny})`,
      )
      // A blurred shadow and paper grain are costly to filter over a large
      // area, so only the small flap gets them. A large one casts two plain
      // offset copies of itself instead.
      const large = depth > 70
      const body = part('flap-body')
      if (large) {
        body.removeAttribute('filter')
      } else {
        // The filter works on a region just big enough for the flap and its
        // shadow. Left to itself it would take in the whole of the print
        // behind the flap, which is far larger than what shows.
        let left = Infinity
        let top = Infinity
        let right = -Infinity
        let bottom = -Infinity
        for (const [x, y] of turned) {
          left = Math.min(left, x)
          top = Math.min(top, y)
          right = Math.max(right, x)
          bottom = Math.max(bottom, y)
        }
        const region = part('paper')
        region.setAttribute('x', (left - 20).toFixed(0))
        region.setAttribute('y', (top - 20).toFixed(0))
        region.setAttribute('width', (right - left + 48).toFixed(0))
        region.setAttribute('height', (bottom - top + 52).toFixed(0))
        body.setAttribute('filter', 'url(#tear-paper)')
      }
      part('flap-shadow').setAttribute('points', large ? points : '')
      part('flap-shadow-soft').setAttribute('points', large ? points : '')
    }

    // --- What it sounds and feels like -----------------------------------
    if (advanced > 0 && (mode === 'dragging' || mode === 'finishing')) {
      const now = performance.now()
      if (now - ticked.current > 30) {
        ticked.current = now
        crackle(clamp(0.08 + advanced * 0.045, 0, 0.7))
        navigator.vibrate?.(Math.min(16, 3 + advanced))
      }
    }
    return { advanced, met }
  }, [crackle])

  // The piece is off. The flap drops away and the clip starts to play.
  const rip = useCallback(() => {
    if (current.current === 'ripping' || current.current === 'open') return
    cancelAnimationFrame(tween.current)
    shape.current = { ...shape.current, boost: 1 }
    move('ripping')
    draw()
    film.current?.play().catch(() => {})
    playMusic(true)
    crackle(1)
    navigator.vibrate?.(28)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => move('open'), 420)
  }, [crackle, draw, move, playMusic])

  // Ease the shape toward new values, then run `done`.
  const animate = useCallback(
    (to: Partial<Omit<Shape, 'seed'>>, ms: number, done?: () => void) => {
      cancelAnimationFrame(tween.current)
      const from = { ...shape.current }
      const target = { ...from, ...to }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const start = performance.now()
      const frame = (now: number) => {
        const t = reduced ? 1 : Math.min(1, (now - start) / ms)
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        shape.current = {
          ...shape.current,
          tip: mix(from.tip, target.tip, eased),
          boost: lerp(from.boost, target.boost, eased),
          lean: lerp(from.lean, target.lean, eased),
        }
        const { met } = draw()
        if (current.current === 'finishing' && met) rip()
        else if (t < 1) tween.current = requestAnimationFrame(frame)
        else done?.()
      }
      tween.current = requestAnimationFrame(frame)
    },
    [draw, rip],
  )

  // Let go with enough torn and the rest goes on its own, quicker the less
  // there is left.
  const comeAway = useCallback(() => {
    if (current.current !== 'idle' && current.current !== 'dragging') return
    move('finishing')
    show()
    const tear = line.current
    const left = tear ? (tear.upper - tear.lower) / (tear.hold.length - 1) : 1
    animate({ boost: 1 }, 200 + 620 * left, rip)
  }, [animate, move, rip, show])

  // Closing stops the music and runs the tear back to the corner, over the
  // picture. The folded corner then comes back with a tear line of its own.
  const close = useCallback(() => {
    window.clearTimeout(timer.current)
    move('closing')
    stopMusic()
    animate({ tip: REST, boost: 0, lean: REST_LEAN }, 460, () => {
      shape.current = { ...shape.current, seed: Math.random() * 1000 }
      move('idle')
      hide()
      draw()
    })
  }, [animate, draw, hide, move, stopMusic])

  // Dragging the corner.
  const drag = useRef<{
    x: number
    y: number
    moved: boolean
    at: number
    speed: number
    lastX: number
    lastY: number
  } | null>(null)

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (current.current !== 'idle') return
    setFetched(true)
    prime()
    event.currentTarget.setPointerCapture(event.pointerId)
    cancelAnimationFrame(tween.current)
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      moved: false,
      at: performance.now(),
      speed: 0,
      lastX: event.clientX,
      lastY: event.clientY,
    }
    move('dragging')
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const origin = drag.current
    if (!origin || current.current !== 'dragging') return
    const dx = Math.min(0, event.clientX - origin.x)
    const dy = Math.min(0, event.clientY - origin.y)
    if (Math.hypot(dx, dy) > 4 && !origin.moved) {
      origin.moved = true
      show()
    }

    // How fast the hand is moving, smoothed, for the moment it lets go.
    const now = performance.now()
    const elapsed = Math.max(1, now - origin.at)
    const speed = Math.hypot(event.clientX - origin.lastX, event.clientY - origin.lastY) / elapsed
    origin.speed = lerp(origin.speed, speed, 0.4)
    origin.at = now
    origin.lastX = event.clientX
    origin.lastY = event.clientY

    const tip: Point = [PEEK[0] + dx, PEEK[1] + dy]
    // The tear leans the way it is being pulled. It eases toward the new
    // direction, so a change of mind bends the tear instead of jumping it.
    const sideways = Math.abs(tip[0]) / (Math.abs(tip[0]) + Math.abs(tip[1]) || 1)
    const lean = lerp(shape.current.lean, sideways, 0.18)
    shape.current = { ...shape.current, tip, lean }
    if (draw().met) {
      drag.current = null
      rip()
    }
  }

  const onPointerUp = () => {
    // Lifting a finger counts as a tap where pressing down does not.
    prime()
    const origin = drag.current
    drag.current = null
    if (current.current !== 'dragging') return
    const tear = line.current
    const torn = tear ? 1 - (tear.upper - tear.lower) / (tear.hold.length - 1) : 0
    // Far enough, or let go with a flick, and the piece comes away.
    if (torn > 0.3 || (torn > 0.12 && origin && origin.speed > 0.9)) {
      comeAway()
      return
    }
    move('idle')
    hide()
    if (origin && !origin.moved) {
      // A plain click gives the corner a tug, as a hint that it pulls.
      animate({ tip: TUG }, 170, () => animate({ tip: REST }, 300))
    } else {
      // Not far enough: the corner is laid back down and the tear closes.
      animate({ tip: REST, lean: REST_LEAN }, 340)
    }
  }

  // The pointer drags; the keyboard rips in one go, in a direction of its own.
  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      prime()
      shape.current = { ...shape.current, lean: 0.3 + Math.random() * 0.4 }
      comeAway()
    }
  }

  useEffect(() => {
    // Every visit gets its own tear.
    shape.current = { ...shape.current, seed: Math.random() * 1000 }
    draw()
    const onResize = () => draw()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(tween.current)
      window.clearTimeout(timer.current)
      void audio.current?.close()
      music.current?.pause()
    }
  }, [draw])

  useEffect(() => {
    if (state !== 'open') return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, close])

  // If the browser would not start the music, the next press, tap or key
  // anywhere on the page is allowed to.
  useEffect(() => {
    if (!refused) return
    const retry = () => playMusic(false)
    const events = ['pointerup', 'click', 'keydown'] as const
    events.forEach((name) => window.addEventListener(name, retry))
    return () => events.forEach((name) => window.removeEventListener(name, retry))
  }, [refused, playMusic])

  // Out of sight, out of earshot. A page that cannot be seen (another tab,
  // the browser put away, the phone asleep) stops the music and the clip.
  // Seen again, the clip carries on. The music carries on too if it was only
  // a moment; after longer, sound starting up by itself would be a surprise,
  // so it waits for "Turn sound on". Leaving the page stops the music too.
  useEffect(() => {
    let hiddenAt = 0
    const onChange = () => {
      if (document.hidden) {
        hiddenAt = performance.now()
        music.current?.pause()
        film.current?.pause()
      } else if (wanted.current) {
        film.current?.play().catch(() => {})
        if (performance.now() - hiddenAt < A_MOMENT) playMusic(false)
        else setHeld(true)
      }
    }
    const onLeave = () => music.current?.pause()
    document.addEventListener('visibilitychange', onChange)
    window.addEventListener('pagehide', onLeave)
    return () => {
      document.removeEventListener('visibilitychange', onChange)
      window.removeEventListener('pagehide', onLeave)
    }
  }, [playMusic])

  const toggleMuted = () => {
    const next = !muted
    setMuted(next)
    silenced.current = next
    wake()
    if (music.current) music.current.muted = next
  }
  const changeVolume = (next: number) => {
    setVolume(next)
    position.current = next
    wake()
    setLoudness(loudness(next))
    try {
      window.localStorage.setItem(VOLUME_KEY, String(next))
    } catch {
      // Not kept for next time, which is fine.
    }
  }
  // The clip waits on its first frame. It starts to play when the piece
  // comes away (see `rip`), and goes back to its first frame when the sheet
  // has been taped back or the corner let go.
  useEffect(() => {
    const clip = film.current
    if (!clip) return
    if (!showing) clip.pause()
    clip.currentTime = 0
  }, [showing, fetched])


  return (
    <div ref={box} className={styles.tear} data-state={state}>
      {/* What is behind the sheet */}
      <div ref={hole} className={styles.hole}>
        {/*
          The picture and the dot screen, which the stylesheet turns into a
          halftone. The still is the picture until the clip is over it.
        */}
        <div className={styles.print} style={{ backgroundImage: `url(${POSTER})` }}>
          {fetched && (
            <video
              ref={film}
              src={CLIP}
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              tabIndex={-1}
              aria-label="Rick Astley singing and dancing in the opening of the Never Gonna Give You Up music video. A silent loop."
            />
          )}
          <div className={styles.screen} />
        </div>
        <div className={styles.ink} />
      </div>

      <svg ref={svg} className={styles.drawing} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="tear-clip">
            <polygon data-part="clip" />
          </clipPath>
          {/* Soft shadow the sheet casts into the hole */}
          <filter id="tear-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          {/*
            The flap shows the back of the sheet: the same stock as the front,
            a touch paler, shaded from the crease to the tip. The colours come
            from the stylesheet so both themes work.
          */}
          <linearGradient id="tear-curl" data-part="curl" gradientUnits="userSpaceOnUse">
            <stop offset="0" className={styles.curlCrease} />
            <stop offset="0.07" className={styles.curlShade} />
            <stop offset="0.22" className={styles.curlRidge} />
            <stop offset="0.6" className={styles.curlBack} />
            <stop offset="1" className={styles.curlTip} />
          </linearGradient>
          {/* The drafting grid, showing through the back of the sheet */}
          <pattern id="tear-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" className={styles.ghost} />
          </pattern>
          <clipPath id="tear-flap-clip">
            <polygon data-part="flap-print" />
          </clipPath>
          {/* The shadow the flap casts on the sheet, and paper grain on the flap */}
          <filter id="tear-paper" data-part="paper" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
            <feOffset in="blur" dx="4" dy="7" result="offset" />
            <feColorMatrix
              in="offset"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.12  0 0 0 0.5 0"
              result="shadow"
            />
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="2" result="grain" />
            <feColorMatrix
              in="grain"
              type="matrix"
              values="0 0 0 0 0.02  0 0 0 0 0.03  0 0 0 0 0.3  0 0 0 0.7 -0.3"
              result="fleck"
            />
            <feComposite in="fleck" in2="SourceAlpha" operator="in" result="grained" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="grained" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow just inside the tear */}
        <g clipPath="url(#tear-clip)">
          <path data-part="shade" className={styles.shade} filter="url(#tear-soft)" />
        </g>

        {/* The folded-back piece */}
        <g className={styles.flap}>
          <polygon data-part="flap-shadow-soft" className={styles.flapShadowSoft} />
          <polygon data-part="flap-shadow" className={styles.flapShadow} />
          <g data-part="flap-body" filter="url(#tear-paper)">
            <polygon data-part="flap" fill="url(#tear-curl)" />
            <g clipPath="url(#tear-flap-clip)">
              <rect
                data-part="print"
                x="-2000"
                y="-2000"
                width="4000"
                height="4000"
                fill="url(#tear-grid)"
              />
              {/* The frame's border, which runs along these two edges on the front */}
              <polyline data-part="flap-border" className={styles.ghostBorder} />
            </g>
            <polygon data-part="flap-edge" className={styles.flapEdge} />
            <path data-part="flap-torn" className={styles.flapTorn} />
          </g>
        </g>

        {/* White fibre where the paper has split, and a few loose strands */}
        <path data-part="core" className={styles.core} />
        <path data-part="fibres" className={styles.fibres} />
      </svg>

      {(state === 'idle' || state === 'dragging') && (
        <button
          type="button"
          className={styles.grab}
          aria-label="A torn corner of the drawing. Pull it."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={() => {
            setFetched(true)
            if (current.current === 'idle') animate({ tip: PEEK }, 200)
          }}
          onFocus={() => setFetched(true)}
          onPointerLeave={() => {
            if (current.current === 'idle') animate({ tip: REST }, 240)
          }}
          onKeyDown={onKeyDown}
        />
      )}

      {state === 'open' && (
        <div className={styles.controls}>
          <button type="button" className={styles.button} onClick={close}>
            Tape it back
          </button>
          {refused || held ? (
            <button
              type="button"
              className={styles.button}
              onClick={() => {
                setHeld(false)
                playMusic(false)
              }}
            >
              Turn sound on
            </button>
          ) : touch ? (
            <button type="button" className={styles.button} onClick={toggleMuted}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
          ) : (
            <label className={styles.volume}>
              Volume
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={volume}
                onChange={(event) => changeVolume(Number(event.target.value))}
              />
            </label>
          )}
        </div>
      )}
    </div>
  )
}
