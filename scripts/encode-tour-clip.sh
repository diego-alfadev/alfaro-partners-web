#!/usr/bin/env bash
# Encode a generated transition clip for scroll scrubbing and install it for a listing.
# Usage: scripts/encode-tour-clip.sh <input.mp4> <clip-name> [publicId]
set -euo pipefail

input=${1:?input video}
name=${2:?clip name, e.g. dormitorio-1}
public_id=${3:-ap-l8v3}
[[ $name =~ ^[a-z0-9-]+$ ]] || { echo "clip name must be lowercase letters, digits and dashes" >&2; exit 1; }

out_dir="src/assets/property-clips/$public_id"
mkdir -p "$out_dir"

# A keyframe every 6 frames keeps backwards seeks cheap while scrubbing. The BT.709 +
# sRGB tags stop browsers from rendering the video lighter than the photographs.
ffmpeg -v error -y -i "$input" -an \
  -vf "scale=1920:-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 26 \
  -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc iec61966-2-1 -colorspace bt709 -color_range tv \
  -movflags +faststart+write_colr \
  "$out_dir/$name.mp4"

ffprobe -v error -show_entries stream=width,height,duration -show_entries format=size -of default=nw=1 "$out_dir/$name.mp4"
echo "Installed $out_dir/$name.mp4"
