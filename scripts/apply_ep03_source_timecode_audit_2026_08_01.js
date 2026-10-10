const fs = require("fs");

const epRoot = "episodes/EP03";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const auditPath = `${epRoot}/production_system/source_timecode_audit_2026-08-01.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function upsertBy(items, key, item) {
  const index = items.findIndex((candidate) => candidate[key] === item[key]);
  if (index === -1) items.push(item);
  else items[index] = item;
}

function main() {
  const audit = readJson(auditPath);
  const queue = readJson(queuePath);
  for (const shot of queue.shots || []) {
    const override = audit.shots[shot.id];
    if (!override) continue;
    shot.previous_source_timecode = shot.previous_source_timecode || shot.source_timecode;
    shot.source_timecode = override.corrected_source_timecode;
    shot.source_timecode_audit = {
      source_match: override.source_match,
      adaptation_gap: override.adaptation_gap,
      audit_path: "production_system/source_timecode_audit_2026-08-01.json",
    };
  }
  writeJson(queuePath, queue);

  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const artifactId = "EP03-SOURCE-TIMECODE-AUDIT-2026-08-01";
  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "source_audit",
    stage: "source_audit",
    status: "layout_reference",
    created_by: "source-provenance-agent",
    created_at: "2026-08-01",
    paths: [
      "production_system/source_timecode_audit_2026-08-01.json",
      "production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/index.md",
      "production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/timeline_10s_sheet_01.jpg",
      "production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/timeline_10s_sheet_02.jpg",
      "production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/timeline_10s_sheet_03.jpg",
      "production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/timeline_10s_sheet_04.jpg"
    ],
    source_refs: [audit.source_video, audit.source_audio],
    depends_on: ["EP03-PROMPT-ASSET-PACKAGE-2026-07-28"],
    risk_flags: ["source_evidence_only", "adaptation_gaps_present", "not_final_cinematic_frames"],
    notes: "Corrects EP03 shot source_timecodes against local 10-second timeline contact sheets.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: "review-2026-08-01-EP03-source-timecode-audit",
    reviewer_role: "source-provenance-agent",
    reviewer: "codex",
    created_at: "2026-08-01",
    decision: "layout_reference",
    blocking_issues: [
      "Several live-action adaptation beats have no exact raw game-frame equivalent and must be treated as adaptation expansions.",
      "Corrected source frames may contain UI/subtitles/watermarks and cannot become final cinematic keyframes.",
    ],
    required_revisions: [
      "Use corrected source_timecode values for local source evidence boards.",
      "Keep source footage, identity plates, and AI/generated candidates as separate layers in all viewers and manifests.",
    ],
    rubric: {
      local_video_traceability: "pass",
      source_timecode_alignment: "pass_with_adaptation_gaps",
      final_frame_readiness: "not_applicable",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: [
      "production_system/source_timecode_audit_2026-08-01.json",
      "production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/index.md",
    ],
  });

  const sourceEvidencePaths = [
    "production_system/reviews/local_video_source_frames_2026-08-01/index.md",
    "production_system/reviews/local_video_source_frames_2026-08-01/index.json",
    "production_system/reviews/local_video_source_frames_2026-08-01/viewer.html",
    "production_system/reviews/local_video_source_frames_2026-08-01/timeline_10s/index.md",
    ...Object.keys(audit.shots).map((shotId) => `production_system/reviews/local_video_source_frames_2026-08-01/per_shot/${shotId}/${shotId}_local_video_source_evidence_2026-08-01.jpg`),
  ];

  upsertBy(artifacts.artifacts, "id", {
    id: "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    type: "source_evidence",
    stage: "source_audit",
    status: "layout_reference",
    created_by: "source-provenance-agent",
    created_at: "2026-08-01",
    paths: sourceEvidencePaths,
    source_refs: [audit.source_video, audit.source_audio],
    depends_on: ["EP03-SOURCE-TIMECODE-AUDIT-2026-08-01"],
    risk_flags: ["contains_game_ui", "contains_subtitles", "source_evidence_only", "not_final_cinematic_frames"],
    notes: "36 per-shot local video evidence boards, each combining corrected raw-video frames, current source_ref, local previs, proof sheet, and identity plates.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    review_id: "review-2026-08-01-local-video-source-frames",
    reviewer_role: "source-provenance-agent",
    reviewer: "codex",
    created_at: "2026-08-01",
    decision: "layout_reference",
    blocking_issues: [
      "The local video source evidence layer contains game UI/subtitles/watermarks and cannot be used as final cinematic frames.",
      "The evidence boards prove provenance and local identity references only; they do not approve AI-generated or composited frames.",
    ],
    required_revisions: [
      "Use these per-shot boards as the first gate for any future regenerated start/key/end frame.",
      "Keep source evidence, identity plates, local previs, and AI candidates visually separated in the web package.",
    ],
    rubric: {
      local_video_traceability: "pass",
      per_shot_coverage: "36_of_36",
      identity_plate_visibility: "pass",
      final_frame_readiness: "not_applicable",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: sourceEvidencePaths,
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log("applied EP03 source timecode audit");
}

main();
