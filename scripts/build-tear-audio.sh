#!/usr/bin/env bash
# Builds public/tear-audio.mp3, the music that plays behind the torn corner
# of the home page (src/components/torn-corner.tsx).
#
#   scripts/build-tear-audio.sh path/to/source.mp3
#
# The source is an 8-bit cover of the song ("Never Gonna Give You Up (8 Bit
# Remix Cover Version)" by 8 Bit Universe). It is not kept in the repository.
#
# The lead-in silence is cut so the music starts with the picture, and the
# file is made small: one channel at 64 kbit/s, which is plenty for square
# waves.
set -euo pipefail

source="${1:?usage: build-tear-audio.sh source.mp3}"
out="$(dirname "$0")/../public/tear-audio.mp3"

ffmpeg -v error -y -ss 0.19 -i "$source" -vn -map_metadata -1 \
  -ac 1 -ar 44100 -c:a libmp3lame -b:a 64k "$out"

ls -l "$out"
