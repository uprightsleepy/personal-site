"""Build the fonts the social preview images use.

The preview images (src/app/og/[slug]/route.tsx) set each line of a title in a
different width of Archivo. The image renderer cannot read a variable font,
so this script cuts fixed-width instances from the variable font that the
site already installs, keeps the basic Latin characters, and records how wide
each character is so the route can size a line to fill the image.

Run it again only if the widths below change or Archivo is upgraded:

    pip install fonttools brotli
    python3 scripts/build-og-fonts.py

Archivo is licensed under the SIL Open Font License, which permits
redistributing modified versions. The license text is copied beside the fonts.
"""

import json
import shutil
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2"
LICENSE = ROOT / "node_modules/@fontsource-variable/archivo/LICENSE"
OUT = ROOT / "src/app/og/fonts"

WEIGHT = 800
WIDTHS = [62, 84, 100, 125]
# Printable ASCII plus the en dash used in date ranges.
CHARACTERS = [chr(code) for code in range(0x20, 0x7F)] + ["–"]

OUT.mkdir(parents=True, exist_ok=True)
metrics = {}

for width in WIDTHS:
    font = TTFont(SOURCE)
    font = instantiateVariableFont(font, {"wght": WEIGHT, "wdth": width})

    options = Options()
    options.layout_features = []  # the renderer does not apply kerning
    options.name_IDs = [1, 2, 4, 6]
    subsetter = Subsetter(options)
    subsetter.populate(unicodes=[ord(character) for character in CHARACTERS])
    subsetter.subset(font)

    font.flavor = None
    font.save(OUT / f"archivo-{width}-{WEIGHT}.ttf")

    units = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    advances = font["hmtx"].metrics
    metrics[str(width)] = {
        "capHeight": round(font["OS/2"].sCapHeight / units, 4),
        "advance": {
            character: round(advances[cmap[ord(character)]][0] / units, 4)
            for character in CHARACTERS
            if ord(character) in cmap
        },
    }

(OUT / "metrics.json").write_text(json.dumps(metrics, indent=1, ensure_ascii=False) + "\n")
shutil.copyfile(LICENSE, OUT / "OFL.txt")
print("wrote", sorted(path.name for path in OUT.iterdir()))
