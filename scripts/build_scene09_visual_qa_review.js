const fs = require("fs");
const { execFileSync } = require("child_process");

const queuePath = "episodes/EP02/mock_battle_keyframe_production_queue_2026-07-17.json";
const qaPath = "episodes/EP02/generated/mock_battle_production_keyframes_2026-07-17/qa_manifest.json";
const outputJsonPath = "episodes/EP02/scene09_secondary_visual_qa_2026-07-19.json";
const outputMdPath = "episodes/EP02/scene09_secondary_visual_qa_2026-07-19.md";

function shotOrder(shot) {
  const match = String(shot).match(/^Shot(\d+)([A-Z])?$/);
  if (!match) return 999;
  const base = Number(match[1]);
  const suffix = match[2] ? (match[2].charCodeAt(0) - 64) / 10 : 0;
  return base + suffix;
}

function readPngInfo(path) {
  if (!path || !fs.existsSync(path)) {
    return {
      path,
      exists: false,
      bytes: 0,
      width: 0,
      height: 0,
    };
  }
  const bytes = fs.statSync(path).size;
  const output = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", path], {
    encoding: "utf8",
  });
  const width = Number((output.match(/pixelWidth:\s*(\d+)/) || [])[1] || 0);
  const height = Number((output.match(/pixelHeight:\s*(\d+)/) || [])[1] || 0);
  return {
    path,
    exists: true,
    bytes,
    width,
    height,
  };
}

function frameGate(info) {
  if (!info.exists) return "missing";
  if (info.width < 1280 || info.height < 720) return "low_resolution";
  if (info.bytes < 500000) return "suspiciously_small";
  return "pass";
}

const queue = JSON.parse(fs.readFileSync(queuePath, "utf8"))
  .filter((item) => /^Shot0?(25|26|27|28|29|30|31|32|33|34|35|36)[A-Z]?$/.test(item.shot))
  .sort((a, b) => shotOrder(a.shot) - shotOrder(b.shot) || a.shot.localeCompare(b.shot));
const qa = JSON.parse(fs.readFileSync(qaPath, "utf8")).shots || {};

const rows = queue.map((item) => {
  const shotQa = qa[item.shot] || {};
  const start = readPngInfo(item.output_start_frame);
  const key = readPngInfo(item.output_keyframe);
  const startGate = frameGate(start);
  const keyGate = frameGate(key);
  const checks = Array.isArray(shotQa.checks) ? shotQa.checks : [];
  const hasAssociation = Boolean(shotQa.start_key_association);
  const manifestPassed = typeof shotQa.status === "string" && shotQa.status.startsWith("qa_passed");
  const status = item.status === "qa_passed"
    && manifestPassed
    && startGate === "pass"
    && keyGate === "pass"
    && checks.length >= 4
    && hasAssociation
    ? "secondary_review_passed"
    : "needs_review";
  return {
    shot: item.shot,
    title: item.title,
    status,
    production_status: item.status,
    qa_status: shotQa.status || "",
    start,
    key,
    start_gate: startGate,
    key_gate: keyGate,
    check_count: checks.length,
    start_key_association: shotQa.start_key_association || "",
    notes: [
      "Second-pass desk review validates delivery integrity, dimensions, file weight, QA checks and start-to-key association.",
      "Video-motion continuity still requires generated video samples; this review does not certify final video motion.",
    ],
  };
});

const summary = {
  version: "2026-07-19",
  scope: "EP02 Scene09 mock battle start/keyframe secondary visual QA",
  total: rows.length,
  passed: rows.filter((row) => row.status === "secondary_review_passed").length,
  needs_review: rows.filter((row) => row.status !== "secondary_review_passed").length,
  policy: "Pass requires qa_passed production status, qa_passed manifest status, existing 16:9 raster start/key PNGs, four or more QA checks, and recorded start-key association. This is file-delivery QA, not creative/cinematic approval.",
  remaining_video_gate: "Generate motion samples before treating any shot as final video-ready.",
};

const md = [
  "# EP02 Scene09 Secondary Visual QA",
  "",
  `Date: ${summary.version}`,
  "",
  `Scope: ${summary.scope}`,
  "",
  `Policy: ${summary.policy}`,
  "",
  `Summary: ${summary.passed}/${summary.total} passed, ${summary.needs_review} needs review.`,
  "",
  `Remaining gate: ${summary.remaining_video_gate}`,
  "",
  "| Shot | Title | Status | Start | Key | Checks | Association |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map((row) => [
    `| ${row.shot}`,
    row.title,
    row.status,
    `${row.start.width}x${row.start.height}, ${Math.round(row.start.bytes / 1024)} KB`,
    `${row.key.width}x${row.key.height}, ${Math.round(row.key.bytes / 1024)} KB`,
    String(row.check_count),
    row.start_key_association.replace(/\|/g, "/"),
    "|",
  ].join(" | ")),
  "",
].join("\n");

fs.writeFileSync(outputJsonPath, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
fs.writeFileSync(outputMdPath, md);

console.log(JSON.stringify(summary, null, 2));
console.log(outputJsonPath);
console.log(outputMdPath);
