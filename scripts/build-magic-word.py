"""Build the animated figure for the About portrait's joke.

    pip install pillow numpy
    python3 scripts/build-magic-word.py

Reads scripts/source/magic-word.gif, a pixel-art animation of Henry wagging a
finger, and prints every frame in one ink on a clear ground, so the sheet and
its grid show through wherever there is no ink.

It is a halftone, but one that keeps the drawing. The picture is compared
with the screen point by point, not sampled once per dot: light areas come
out solid, dark areas and the drawn lines come out empty, and only the tones
in between break into dots. So the suit is a screen of dots and the glasses,
the mouth and the outlines stay as sharp as they were drawn.

There is a version for each theme, because the ink is a different thing in
each:

  Blueprint  the ink is white, so it is the figure's light parts that are
             printed, and a fine line is drawn round the figure to hold its
             dark edges against the blue.
  Paper      the ink is blue, so it is the figure's dark parts that are
             printed, as on any sheet of paper.

Writes, for each theme:
  public/magic-word-<theme>.webp  the animation, with the source's timing
  public/magic-word-<theme>.png   its first frame, for readers who ask for
                                  reduced motion
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts" / "source" / "magic-word.gif"
PUBLIC = ROOT / "public"

SCALE = 2  # output pixels per source pixel
PITCH = 7.0  # distance between dot centres, in output pixels
ANGLE = np.deg2rad(45)  # the classic screen angle for a single ink
SUPERSAMPLE = 3  # work large, then shrink, for smooth edges
EDGE = 2  # width of the line round the figure, in output pixels
# Tones below DARK print as solid dark and above LIGHT as solid light; the
# screen only shows between them.
DARK, LIGHT = 0.2, 0.64
INKS = {"blueprint": (255, 255, 255), "paper": (27, 34, 210)}

source = Image.open(SOURCE)

# Trim the empty space round the figure: the box that holds it in every
# frame, with a little room for the line drawn round it.
MARGIN = 4  # source pixels
left, top, right, bottom = source.width, source.height, 0, 0
for index in range(source.n_frames):
    source.seek(index)
    box = source.convert("RGBA").getchannel("A").point(lambda a: 255 if a > 127 else 0).getbbox()
    if box:
        left, top = min(left, box[0]), min(top, box[1])
        right, bottom = max(right, box[2]), max(bottom, box[3])
CROP = (
    max(0, left - MARGIN),
    max(0, top - MARGIN),
    min(source.width, right + MARGIN),
    min(source.height, bottom + MARGIN),
)
out_w, out_h = (CROP[2] - CROP[0]) * SCALE, (CROP[3] - CROP[1]) * SCALE
big = (out_w * SUPERSAMPLE, out_h * SUPERSAMPLE)

# The screen: a field of thresholds that rises and falls in a grid of dots
# turned 45 degrees. A point prints light where the picture is lighter than
# the screen there. It is the same for every frame, so the dots stay put.
ys, xs = np.mgrid[0 : big[1], 0 : big[0]].astype(np.float32)
pitch = PITCH * SUPERSAMPLE
u = (xs * np.cos(ANGLE) + ys * np.sin(ANGLE)) * (2 * np.pi / pitch)
v = (-xs * np.sin(ANGLE) + ys * np.cos(ANGLE)) * (2 * np.pi / pitch)
screen = 0.5 + (np.cos(u) + np.cos(v)) / 4


def separations(frame: Image.Image) -> dict[str, Image.Image]:
    """One frame as the ink to lay down in each theme."""
    # Enlarged without smoothing, so the drawing's pixels keep their edges.
    rgba = frame.convert("RGBA").crop(CROP).resize(big, Image.NEAREST)
    inside = np.asarray(rgba.getchannel("A")) > 127
    tone = np.asarray(rgba.convert("L"), dtype=np.float32) / 255.0
    tone = np.clip((tone - DARK) / (LIGHT - DARK), 0, 1)
    light = (tone > screen) & inside
    dark = ~light & inside

    # The line round the figure, for the white ink: the shape grown, less the shape.
    shape = Image.fromarray((inside * 255).astype(np.uint8), "L")
    grown = shape.filter(ImageFilter.MaxFilter(2 * EDGE * SUPERSAMPLE + 1))
    line = (np.asarray(grown) > 0) & ~inside

    out = {}
    for theme, cover in (("blueprint", light | line), ("paper", dark)):
        alpha = Image.fromarray((cover * 255).astype(np.uint8), "L").resize((out_w, out_h), Image.LANCZOS)
        # Ink or no ink, nothing between. It suits pixel art, which is shown
        # at half this size, and it keeps the files small.
        alpha = alpha.point(lambda a: 255 if a > 127 else 0)
        ink = Image.new("RGBA", (out_w, out_h), INKS[theme] + (0,))
        ink.putalpha(alpha)
        out[theme] = ink
    return out


frames = {theme: [] for theme in INKS}
durations = []
for index in range(source.n_frames):
    source.seek(index)
    durations.append(source.info.get("duration", 100))
    for theme, image in separations(source.copy()).items():
        frames[theme].append(image)

for theme, images in frames.items():
    images[0].save(PUBLIC / f"magic-word-{theme}.png", optimize=True)
    images[0].save(
        PUBLIC / f"magic-word-{theme}.webp",
        save_all=True,
        append_images=images[1:],
        duration=durations,
        loop=0,
        lossless=True,
        method=6,
    )
print(f"{len(durations)} frames, {out_w}x{out_h}")
