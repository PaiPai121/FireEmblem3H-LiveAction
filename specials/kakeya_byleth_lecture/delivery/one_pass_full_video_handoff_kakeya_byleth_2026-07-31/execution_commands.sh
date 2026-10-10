#!/usr/bin/env bash
set -euo pipefail

if [ -z "${VIDEO_MODEL_CLI_ARGV_JSON:-}" ]; then
  echo "VIDEO_MODEL_CLI_ARGV_JSON is not set. See model_target_profile.md." >&2
  exit 2
fi

echo "This package is ready for one-pass full-duration submission, but no local video model command has been configured."
echo "Use submission_payload.jsonl or submission_queue.csv with your image-to-video provider."
