#!/usr/bin/env bash
set -euo pipefail

PORT="${GEMINI_CDP_PORT:-9222}"
EDGE="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"

if curl -s "http://127.0.0.1:${PORT}/json/version" >/dev/null 2>&1; then
  echo "Edge CDP is already available at http://127.0.0.1:${PORT}"
  exit 0
fi

if pgrep -f "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" >/dev/null 2>&1; then
  cat <<MSG
Microsoft Edge is already running, but CDP is not available on port ${PORT}.

To reuse your existing Gemini login safely:
1. Save any important Edge work.
2. Quit Microsoft Edge completely.
3. Run this script again:
   scripts/launch_edge_for_gemini_cdp.sh

This script does not close Edge for you.
MSG
  exit 2
fi

if [[ ! -x "${EDGE}" ]]; then
  echo "Microsoft Edge executable not found: ${EDGE}" >&2
  exit 1
fi

"${EDGE}" \
  --remote-debugging-port="${PORT}" \
  --profile-directory=Default \
  "https://gemini.google.com/app" >/tmp/gemini-edge-cdp.log 2>&1 &

echo "Launching Edge with CDP at http://127.0.0.1:${PORT}"
for _ in {1..30}; do
  if curl -s "http://127.0.0.1:${PORT}/json/version" >/dev/null 2>&1; then
    echo "Ready: http://127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 1
done

echo "Timed out waiting for Edge CDP. See /tmp/gemini-edge-cdp.log" >&2
if [[ -s /tmp/gemini-edge-cdp.log ]]; then
  echo "--- /tmp/gemini-edge-cdp.log ---" >&2
  tail -40 /tmp/gemini-edge-cdp.log >&2
fi
exit 1
