"""Build the animated figure for the About portrait's joke.

    pip install pillow numpy
    python3 scripts/build-magic-word.py

Reads scripts/source/magic-word.gif, a pixel-art animation of Henry wagging a
finger, and prints every frame through the same halftone screen as the About
portrait (see build-print-assets.py): white dots on black, which the page
blends over blue. The space around the figure comes out black, so it prints
as the sheet's ink, and a fine white line is drawn round the figure to keep
its dark edges from being lost in it.

Writes:
  public/magic-word.gif        the animation, with the source's own timing
  public/magic-word-still.png  its first frame, for readers who ask for
                               reduced motion
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts" / "source" / "magic-word.gif"
PUBLIC = ROOT / "public"

SCALE = 1.5  # output pixels per source pixel: sharp at the size shown, and a smaller file
PITCH = 4.5  # distance between dot centres, in output pixels: a little finer than the portrait, to keep the face
ANGLE = np.deg2rad(45)
SUPERSAMPLE = 3
EDGE = 2  # width of the line round the figure, in output pixels

source = Image.open(SOURCE)

# Trim the empty space round the figure: the box that holds it in every
# frame, with a little room for the line drawn round it.
MARGIN = 5  # source pixels
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
src_w, src_h = CROP[2] - CROP[0], CROP[3] - CROP[1]
out_w, out_h = round(src_w * SCALE), round(src_h * SCALE)

# The dot screen is the same for every frame, so only the dots that change
# size move between frames.
w, h = out_w * SUPERSAMPLE, out_h * SUPERSAMPLE
pitch = PITCH * SUPERSAMPLE
ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
cos, sin = np.cos(ANGLE), np.sin(ANGLE)
u = xs * cos + ys * sin
v = -xs * sin + ys * cos
cu = np.round(u / pitch) * pitch
cv = np.round(v / pitch) * pitch
cx = cu * cos - cv * sin
cy = cu * sin + cv * cos
distance = np.hypot(xs - cx, ys - cy)
sx = np.clip(cx / SUPERSAMPLE, 0, out_w - 1).astype(np.int32)
sy = np.clip(cy / SUPERSAMPLE, 0, out_h - 1).astype(np.int32)


def printed(frame: Image.Image) -> Image.Image:
    """One frame as a halftone, with the figure outlined."""
    rgba = frame.convert("RGBA").crop(CROP).resize((out_w, out_h), Image.LANCZOS)
    alpha = np.asarray(rgba.getchannel("A"), dtype=np.float32) / 255.0
    tone = np.asarray(rgba.convert("L"), dtype=np.float32) / 255.0
    # Lift the darks a little so the suit and hair print as dots, not solid ink.
    tone = 0.08 + 0.92 * np.clip(tone, 0, 1) ** 0.85
    tone = tone * (alpha > 0.5)

    radius = pitch * 0.72 * np.sqrt(tone[sy, sx])
    dots = np.clip(radius - distance + 0.5, 0, 1)
    halftone = Image.fromarray((dots * 255).astype(np.uint8), "L").resize((out_w, out_h), Image.LANCZOS)

    # The line round the figure: the figure's shape grown by EDGE, less the shape.
    shape = rgba.getchannel("A").point(lambda a: 255 if a > 127 else 0)
    grown = shape.filter(ImageFilter.MaxFilter(2 * int(round(EDGE)) + 1))
    edge = np.clip(np.asarray(grown, dtype=np.int16) - np.asarray(shape, dtype=np.int16), 0, 255).astype(np.uint8)
    out = np.maximum(np.asarray(halftone), edge)
    # Nothing prints outside the line.
    out = out * (np.asarray(grown) > 0)
    return Image.fromarray(out.astype(np.uint8), "L")


frames, durations = [], []
for index in range(source.n_frames):
    source.seek(index)
    durations.append(source.info.get("duration", 100))
    # Four grey levels keep the dot edges smooth and the file small.
    frames.append(printed(source.copy()).quantize(colors=4, dither=Image.Dither.NONE))

frames[0].save(PUBLIC / "magic-word-still.png", optimize=True)
frames[0].save(
    PUBLIC / "magic-word.gif",
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    optimize=True,
    disposal=1,
)
print(f"{len(frames)} frames, {out_w}x{out_h}")
