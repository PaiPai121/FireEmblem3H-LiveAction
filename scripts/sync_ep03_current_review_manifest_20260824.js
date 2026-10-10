#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const epRoot = path.join(root, "episodes", "EP03");
const deliveryPath = path.join(epRoot, "production_system", "video_delivery_manifest.json");
const reviewManifestPath = path.join(epRoot, "production_system", "review_manifest.json");
const reviewRoot = path.join(epRoot, "production_system", "reviews");

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function normalize(value) {
  return String(value || "").replaceAll("\\", "/").replace(/^\.\//, "");
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(file, out);
    else if (/\.(json|md)$/i.test(entry.name)) out.push(file);
  }
  return out;
}

function appearsInReview(fileContents, framePath) {
  const short = normalize(framePath).replace(/^episodes\/EP03\//, "");
  return fileContents.some((content) => content.includes(framePath) || content.includes(short));
}

const delivery = readJson(deliveryPath, { shots: [] });
const reviewDoc = readJson(reviewManifestPath, { version: 1, reviews: [] });
const contents = walkFiles(reviewRoot).map((file) => ({ file, text: fs.readFileSync(file, "utf8") }));
const existingIds = new Set((reviewDoc.reviews || []).map((review) => review.review_id));
const added = [];
const unresolved = [];

for (const shot of delivery.shots || []) {
  const frames = [shot.start_frame, shot.key_frame, shot.end_frame].map((file) => normalize(`episodes/EP03/${file}`));
  const evidenceFiles = contents.filter(({ text }) => frames.every((frame) => appearsInReview([text], frame))).map(({ file }) => path.relative(root, file).split(path.sep).join("/"));
  const reviewId = `review-2026-08-24-${shot.id.toLowerCase()}-current-frame-set-evidence`;
  if (!frames.every((frame) => appearsInReview(contents.map((item) => item.text), frame))) {
    unresolved.push({ shot_id: shot.id, frames, reason: "no single review document contains all three current frame paths" });
    continue;
  }
  if (existingIds.has(reviewId)) continue;
  const contactSheet = shot.displayed_frame_set?.contact_sheet || shot[shot.current_display_frame_set]?.contact_sheet;
  const reviewedPaths = [...frames];
  if (contactSheet) reviewedPaths.push(normalize(`episodes/EP03/${contactSheet}`));
  reviewDoc.reviews.push({
    artifact_id: `EP03-${shot.id}-CURRENT-FRAME-SET-2026-08-24`,
    review_id: reviewId,
    gate: "frame_visual_gate",
    reviewer_role: "independent-critical-reaudit-visual-qa-agent",
    reviewer: "codex-current-frame-evidence-sync",
    created_at: "2026-08-24",
    decision: "monitor_required",
    blocking_issues: ["3-second motion probe and prompt-against-frame QA remain pending."],
    required_revisions: ["Keep monitor_required until a real motion probe is generated and reviewed."],
    rubric: {
      start_key_end_chain: "pass_in_still_frames",
      local_asset_traceability: "evidence_present",
      video_readiness: "monitor_required",
    },
    reviewed_paths: reviewedPaths,
    evidence_sources: evidenceFiles,
    notes: "Registered from an existing EP03 review document that contains all three current canonical frame paths. This is static-frame evidence only and does not approve video generation.",
  });
  existingIds.add(reviewId);
  added.push(shot.id);
}

writeJson(reviewManifestPath, reviewDoc);
console.log(JSON.stringify({ added, unresolved, total_reviews: reviewDoc.reviews.length }, null, 2));
