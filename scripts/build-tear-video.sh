#!/usr/bin/env bash
# Builds public/tear-video.mp4, the clip that plays behind the torn corner of
# the home page (src/components/torn-corner.tsx), and public/tear-poster.jpg,
# its first frame.
#
#   scripts/build-tear-video.sh path/to/source.mp4 [start seconds] [length seconds]
#
# The source is the music video (1280x720, with the 4:3 picture pillarboxed).
# It is not kept in the repository. The defaults take its opening, from the
# first frame to the cut where the first verse starts.
#
# The page prints the clip through a halftone screen whose dots are about
# 7px apart, so very little of the picture survives. The clip is made to
# match: no sound, grey, 320x180, 12.5 frames a second. That keeps it small
# enough to be ready the moment the corner is pulled.
set -euo pipefail

source="${1:?usage: build-tear-video.sh source.mp4 [start] [length]}"
start="${2:-0.04}"
length="${3:-18.16}"
out="$(dirname "$0")/../public/tear-video.mp4"

# crop: a 16:9 window on the 4:3 picture, a little above centre to keep heads in.
# eq:   more contrast, because a halftone flattens the pale tones of the film.
ffmpeg -v error -y -ss "$start" -t "$length" -i "$source" -an \
  -vf "crop=960:540:160:70,fps=12.5,scale=320:-2:flags=area,format=gray,eq=contrast=1.2,format=yuv420p" \
  -c:v libx264 -preset veryslow -crf 30 -profile:v main -g 50 \
  -movflags +faststart "$out"

# The clip's first frame, as a still. The page shows it behind the folded
# corner before the clip has been fetched.
poster="$(dirname "$0")/../public/tear-poster.jpg"
ffmpeg -v error -y -i "$out" -frames:v 1 -q:v 5 "$poster"

ls -l "$out" "$poster"
