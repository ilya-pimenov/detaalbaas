#!/usr/bin/env bash
#
# optimize-media.sh — compress photos/videos for the web with ffmpeg.
# Requires ffmpeg (brew install ffmpeg).
#
# Usage:
#   scripts/optimize-media.sh photo path/to/big.jpg  public/media/photos/nice-name.jpg
#   scripts/optimize-media.sh video path/to/clip.mov public/media/videos/nice-name.mp4
#
# Photos  -> max 2000px wide, quality ~q3 JPEG.
# Videos  -> H.264 MP4, max 1280px tall, CRF 24, web-streaming (faststart),
#            plus a poster image written next to the output as *-poster.jpg.

set -euo pipefail

kind="${1:-}"; src="${2:-}"; out="${3:-}"
if [[ -z "$kind" || -z "$src" || -z "$out" ]]; then
  grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 1
fi

case "$kind" in
  photo)
    ffmpeg -y -i "$src" -vf "scale='min(2000,iw)':-2" -q:v 3 -pix_fmt yuvj420p "$out"
    echo "Wrote $out ($(du -h "$out" | cut -f1))"
    ;;
  video)
    ffmpeg -y -i "$src" -vf "scale=-2:'min(1280,ih)'" \
      -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 24 -preset slow \
      -c:a aac -b:a 128k -movflags +faststart "$out"
    poster="${out%.*}-poster.jpg"
    ffmpeg -y -ss 1 -i "$out" -frames:v 1 -q:v 3 "$poster"
    echo "Wrote $out ($(du -h "$out" | cut -f1)) and $poster"
    ;;
  *)
    echo "Unknown kind '$kind' (use 'photo' or 'video')"; exit 1 ;;
esac
