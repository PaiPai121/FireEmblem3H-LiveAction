#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TRACKER="$ROOT/episodes/EP02/video_generation_tracker_2026-07-14.csv"
OUT_DIR="$ROOT/episodes/EP02/video_outputs/first_pass"
ASSEMBLY_DIR="$ROOT/episodes/EP02/video_outputs/assembly"
LIST_FILE="$ASSEMBLY_DIR/concat_first_pass.txt"
OUT_FILE="$ASSEMBLY_DIR/EP02_first_pass_assembly.mp4"

mkdir -p "$OUT_DIR" "$ASSEMBLY_DIR"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but was not found on PATH." >&2
  exit 1
fi

if [[ ! -f "$TRACKER" ]]; then
  echo "Tracker not found: $TRACKER" >&2
  exit 1
fi

BLACK_SHOT="$OUT_DIR/Shot042.mp4"
if [[ ! -f "$BLACK_SHOT" ]]; then
  ffmpeg -y \
    -f lavfi -i color=c=black:s=1920x1080:r=24:d=4 \
    -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 \
    -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac "$BLACK_SHOT"
fi

missing=0
while IFS=, read -r shot title duration job_file still expected_output status review_notes; do
  [[ "$shot" == "shot" ]] && continue
  [[ -z "$shot" ]] && continue
  clip="$ROOT/$expected_output"
  if [[ ! -f "$clip" ]]; then
    echo "Missing clip for $shot: $clip" >&2
    missing=$((missing + 1))
  fi
done < "$TRACKER"

if [[ "$missing" -gt 0 ]]; then
  echo "Cannot assemble: $missing clip(s) missing." >&2
  exit 1
fi

: > "$LIST_FILE"
while IFS=, read -r shot title duration job_file still expected_output status review_notes; do
  [[ "$shot" == "shot" ]] && continue
  [[ -z "$shot" ]] && continue
  clip="$ROOT/$expected_output"
  printf "file '%s'\n" "$clip" >> "$LIST_FILE"
done < "$TRACKER"

ffmpeg -y -f concat -safe 0 -i "$LIST_FILE" -c copy "$OUT_FILE"

echo "Assembled: $OUT_FILE"
