"""Build the two print-texture images the site uses.

    pip install pillow numpy
    python3 scripts/build-print-assets.py

1. public/headshot-halftone.png: the About portrait as a halftone, the dot
   screen a press uses to print a photograph in one ink. White dots on black;
   the page blends it over blue, so black prints as the sheet and white as ink.
   Re-run after replacing public/headshot.jpg.

2. public/grain.png: a small tile of noise, used as a mask to give the sheet
   the grain of a print. It only needs building once.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageOps

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

for name in ("headshot-halftone.png", "grain.png"):
    print(name, (PUBLIC / name).stat().st_size // 1024, "KB")
