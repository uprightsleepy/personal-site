"""Build the print-texture images the site uses.

    pip install pillow numpy
    python3 scripts/build-print-assets.py

1. public/headshot-halftone.png: the About portrait as a halftone, the dot
   screen a press uses to print a photograph in one ink. White dots on black;
   the page blends it over blue, so black prints as the sheet and white as ink.
   Re-run after replacing public/headshot.jpg.

2. public/grain.png: a small tile of noise, used as a mask to give the sheet
   the grain of a print.

3. public/flecks.png: a tile that is solid except for scattered chips, used
   as a mask on large type so it prints like worn wood type.

4. public/halftone-fade.png: a strip of halftone dots that grow from nothing
   to nearly solid, used as a mask for the band at the foot of each page.

The last three only need building once.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

# --- Halftone portrait -----------------------------------------------------

OUT_W, OUT_H = 800, 1000  # about twice the size it is shown at
PITCH = 8.0  # distance between dot centres, in output pixels
ANGLE = np.deg2rad(45)  # the classic screen angle for a single ink
SUPERSAMPLE = 3  # draw large, then shrink, for smooth dot edges

photo = Image.open(PUBLIC / "headshot.jpg").convert("L")
# Crop to the 4:5 frame the page shows, centred.
photo = ImageOps.fit(photo, (OUT_W, OUT_H), Image.LANCZOS, centering=(0.5, 0.4))
photo = ImageOps.autocontrast(photo, cutoff=1)
tone = np.asarray(photo, dtype=np.float32) / 255.0
# Darken the midtones so skin prints as mid-sized dots, not solid ink.
tone = np.clip(tone, 0, 1) ** 1.5

w, h = OUT_W * SUPERSAMPLE, OUT_H * SUPERSAMPLE
pitch = PITCH * SUPERSAMPLE
ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
cos, sin = np.cos(ANGLE), np.sin(ANGLE)
# Rotate into the screen's own grid, snap to the nearest dot centre, rotate back.
u = xs * cos + ys * sin
v = -xs * sin + ys * cos
cu = np.round(u / pitch) * pitch
cv = np.round(v / pitch) * pitch
cx = cu * cos - cv * sin
cy = cu * sin + cv * cos
distance = np.hypot(xs - cx, ys - cy)

# Each dot takes its size from the photo's brightness at the dot's centre.
sx = np.clip(cx / SUPERSAMPLE, 0, OUT_W - 1).astype(np.int32)
sy = np.clip(cy / SUPERSAMPLE, 0, OUT_H - 1).astype(np.int32)
brightness = tone[sy, sx]
radius = pitch * 0.72 * np.sqrt(brightness)  # 0.72 lets full white close up
dots = np.clip(radius - distance + 0.5, 0, 1)

halftone = Image.fromarray((dots * 255).astype(np.uint8), "L")
halftone = halftone.resize((OUT_W, OUT_H), Image.LANCZOS)
# Six grey levels keep the dot edges smooth and the file small.
halftone = halftone.quantize(colors=6, dither=Image.Dither.NONE)
halftone.save(PUBLIC / "headshot-halftone.png", optimize=True)

# --- Grain tile ------------------------------------------------------------

SIZE = 256
rng = np.random.default_rng(1995)
noise = rng.random((SIZE, SIZE)).astype(np.float32)
# Keep roughly the brightest third as specks of varying strength.
alpha = np.clip((noise - 0.62) / 0.38, 0, 1)
grain = np.zeros((SIZE, SIZE, 4), dtype=np.uint8)
grain[..., :3] = 255
grain[..., 3] = (alpha * 255).astype(np.uint8)
Image.fromarray(grain, "RGBA").save(PUBLIC / "grain.png", optimize=True)

# --- Fleck tile ------------------------------------------------------------

FLECK = 512  # shown at half this size, so the chips stay sharp on dense screens
field = rng.random((FLECK, FLECK)).astype(np.float32)
# Blur a 3x3 tiling and keep the middle, so the tile repeats without a seam.
tiled = Image.fromarray((np.tile(field, (3, 3)) * 255).astype(np.uint8), "L")
tiled = tiled.filter(ImageFilter.GaussianBlur(2.2))
smooth = np.asarray(tiled, dtype=np.float32)[FLECK : FLECK * 2, FLECK : FLECK * 2]
# The lowest percent or two of the smoothed noise become chips with soft edges.
low, high = np.percentile(smooth, [1.0, 2.3])
solid = np.clip((smooth - low) / (high - low), 0, 1)
flecks = np.zeros((FLECK, FLECK, 4), dtype=np.uint8)
flecks[..., :3] = 255
flecks[..., 3] = (solid * 255).astype(np.uint8)
Image.fromarray(flecks, "RGBA").save(PUBLIC / "flecks.png", optimize=True)

# --- Halftone fade ---------------------------------------------------------

STEP = 14  # half the diagonal spacing of the 45 degree screen, in pixels
FADE_W, FADE_H = STEP * 2 * 8, STEP * 2 * 9  # whole dots, so it tiles sideways
SS = 3
fy, fx = np.mgrid[0 : FADE_H * SS, 0 : FADE_W * SS].astype(np.float32)
fx, fy = fx / SS, fy / SS
# Dot centres sit on a checkerboard of STEP-sized squares.
gx = np.round(fx / STEP)
gy = np.round(fy / STEP)
odd = (gx + gy) % 2 == 1
# For odd squares the nearest centre is a neighbour; pick the closer axis.
dx, dy = fx / STEP - gx, fy / STEP - gy
shift_x = np.where(np.abs(dx) >= np.abs(dy), np.where(dx >= 0, 1, -1), 0)
shift_y = np.where(np.abs(dx) >= np.abs(dy), 0, np.where(dy >= 0, 1, -1))
gx = np.where(odd, gx + shift_x, gx)
gy = np.where(odd, gy + shift_y, gy)
centre_x, centre_y = gx * STEP, gy * STEP
# Dots grow from nothing at the top to nearly touching at the bottom.
growth = np.clip(centre_y / FADE_H, 0, 1) ** 1.25
dot_radius = STEP * 0.98 * growth
edge = np.clip((dot_radius - np.hypot(fx - centre_x, fy - centre_y)) * SS + 0.5, 0, 1)
fade = Image.fromarray((edge * 255).astype(np.uint8), "L").resize((FADE_W, FADE_H), Image.LANCZOS)
fade_rgba = np.zeros((FADE_H, FADE_W, 4), dtype=np.uint8)
fade_rgba[..., :3] = 255
fade_rgba[..., 3] = np.asarray(fade)
Image.fromarray(fade_rgba, "RGBA").save(PUBLIC / "halftone-fade.png", optimize=True)

for name in ("headshot-halftone.png", "grain.png", "flecks.png", "halftone-fade.png"):
    print(name, (PUBLIC / name).stat().st_size // 1024, "KB")
