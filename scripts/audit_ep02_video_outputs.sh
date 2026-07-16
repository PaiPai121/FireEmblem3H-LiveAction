#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TRACKER="$ROOT/episodes/EP02/video_generation_tracker_2026-07-14.csv"
OUT_DIR="$ROOT/episodes/EP02/video_outputs/first_pass"
REPORT="$ROOT/episodes/EP02/video_outputs/first_pass_audit.tsv"

mkdir -p "$OUT_DIR"

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ffprobe is required but was not found on PATH." >&2
  exit 1
fi

printf "shot\texists\tduration_seconds\twidth\theight\tpath\n" > "$REPORT"

while IFS=, read -r shot title duration job_file still expected_output status review_notes; do
  [[ "$shot" == "shot" ]] && continue
  [[ -z "$shot" ]] && continue
  clip="$ROOT/$expected_output"
  if [[ ! -f "$clip" ]]; then
    printf "%s\tno\t\t\t\t%s\n" "$shot" "$clip" >> "$REPORT"
    continue
  fi
  duration_s="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$clip" | awk '{printf "%.3f", $1}')"
  dims="$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "$clip" || true)"
  width="${dims%x*}"
  height="${dims#*x}"
  printf "%s\tyes\t%s\t%s\t%s\t%s\n" "$shot" "$duration_s" "$width" "$height" "$clip" >> "$REPORT"
done < "$TRACKER"

echo "Wrote: $REPORT"
