#!/usr/bin/env bash
set -euo pipefail

# Configure VIDEO_MODEL_CLI_ARGV_JSON before running this.
# Package: video_generation_package_2026-07-25

PACKAGE_DIR="/Users/zekun/FireEmblem3H-LiveAction/specials/blue_lions_food_song/delivery/video_generation_package_2026-07-25"
RUNNER="/Users/zekun/.codex/skills/cinematic-production-pipeline/scripts/run_video_generation_package.js"

node "$RUNNER" "$PACKAGE_DIR" --execute --concat --out "$PACKAGE_DIR/final_edit.mp4"

