#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
QUEUE="$ROOT/EP03/delivery/motion_probe_package_2026-08-10/submission_queue.json"

if [[ -z "${VIDEO_MODEL_CLI_ARGV_JSON:-}" ]]; then
  echo "VIDEO_MODEL_CLI_ARGV_JSON is not set."
  echo "Use the web workflow manually, or set it to a JSON argv template. See execution_plan.json."
  exit 2
fi

node - "$ROOT" "$QUEUE" "$VIDEO_MODEL_CLI_ARGV_JSON" <<'NODE'
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(process.argv[2], "..");
const queuePath = process.argv[3];
const template = JSON.parse(process.argv[4]);
const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"));

function fill(value, row) {
  return String(value)
    .replaceAll("{start_frame}", path.join(repoRoot, row.start_frame))
    .replaceAll("{key_frame}", path.join(repoRoot, row.key_frame))
    .replaceAll("{end_frame}", path.join(repoRoot, row.end_frame))
    .replaceAll("{prompt_path}", path.join(repoRoot, "episodes/EP03", row.prompt_path))
    .replaceAll("{negative_prompt_path}", path.join(repoRoot, "episodes/EP03", row.negative_prompt_path))
    .replaceAll("{duration_seconds}", String(row.probe_duration_seconds))
    .replaceAll("{output_path}", path.join(repoRoot, row.expected_probe_clip));
}

for (const row of queue.shots) {
  fs.mkdirSync(path.dirname(path.join(repoRoot, row.expected_probe_clip)), { recursive: true });
  const argv = template.map((part) => fill(part, row));
  const [cmd, ...args] = argv;
  console.log(["RUN", row.shot_id, cmd, ...args].join(" "));
  const result = spawnSync(cmd, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
NODE
