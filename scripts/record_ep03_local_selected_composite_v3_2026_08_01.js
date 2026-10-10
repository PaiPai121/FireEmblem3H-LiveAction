const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const artifactId = "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01";
const reviewId = "review-2026-08-01-ep03-local-selected-png-composited-previs-v3";
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const queuePath = `${epRoot}/frame_generation_queue.json`;
const reviewPath = `${epRoot}/production_system/reviews/ep03_local_selected_png_composited_previs_v3_review_2026-08-01.md`;
const readmePath = `${epRoot}/production_system/reviews/ep03_local_selected_png_composited_previs_v3_README_2026-08-01.md`;

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

function localFrames(shotId) {
  return {
    start: `storyboards/${shotId}/start_frame.png`,
    key: `storyboards/${shotId}/key_frame.png`,
    end: `storyboards/${shotId}/end_frame.png`,
  };
}

function main() {
  const queue = readJson(queuePath);
  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const shotFramePaths = [];
  const missing = [];

  for (const shot of queue.shots || []) {
    const frames = localFrames(shot.id);
    for (const framePath of Object.values(frames)) {
      const full = `${epRoot}/${framePath}`;
      if (fs.existsSync(full)) shotFramePaths.push(framePath);
      else missing.push(framePath);
    }
    shot.local_selected_png_composited_previs_v3 = {
      frame_set_id: `${shot.id}_local_selected_png_composited_previs_v3_2026-08-01`,
      status: "layout_reference",
      frames,
      review_markdown: "production_system/reviews/ep03_local_selected_png_composited_previs_v3_review_2026-08-01.md",
      note: "Deterministic composite from local selected.png character assets with stronger actor matte and reduced foreground fog. This proves local asset usage but is not final cinematic visual approval.",
    };
  }

  const review = `# EP03 Local Selected.png Composited Previs V3 Review / 2026-08-01

Reviewer role: pipeline-gate-qa-agent
Decision: layout_reference

## Coverage

- Shots covered: ${(queue.shots || []).length}/36
- Frame files covered: ${shotFramePaths.length}/108
- Missing frame files: ${missing.length}
- Contact sheet: \`generated_storyboard_contact_sheet.jpg\`
- Generator: \`scripts/generate_ep03_composited_storyboard_frames.py\`

## Finding

V3 improves the previous local selected.png proof layer by strengthening the actor matte, reducing foreground fog opacity, preserving up to six named characters in group shots, and choosing a more accurate local fallback location for monastery/classroom/cathedral/village/fog beats. Shot007 now uses a monastery cloister background and includes Byleth, Dimitri, Dedue, Felix, Ashe, and Ingrid from local assets.

This is still a deterministic proof/previs layer. It preserves local asset identity better than free image generation, but the frames retain visible compositing and matte limitations. Use it for script-to-shot coverage, identity proof, blocking, web review, and prompt refinement. Do not promote to \`visual_review_passed\` or \`approved_for_video\` without shot-level cinematic cleanup and independent QA.

## Required Revision

For final keyframes, create per-shot cleaned frames from the V3 proof layer using transparent cutouts/manual roto or a constrained cleanup pass, then run visual QA, prompt-against-frame QA, motion probe, and strict continuity before any video package promotion.
`;

  const readme = `# EP03 Local Selected.png Composite V3

This is the current local-asset proof layer for EP3.

V3 keeps the characters anchored to local project assets, improves opacity and scene fallback, and fixes the Shot007 six-character monastery setup. It remains a previs/layout reference rather than final cinematic key art.

Status: \`layout_reference\`
Do not use as: \`approved_for_video\`
`;

  fs.writeFileSync(reviewPath, review);
  fs.writeFileSync(readmePath, readme);
  writeJson(queuePath, queue);

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "storyboard_frame_set_package",
    stage: "storyboard",
    status: "layout_reference",
    created_by: "deterministic-local-asset-compositor",
    created_at: createdAt,
    paths: [
      "generated_storyboard_contact_sheet.jpg",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v3_review_2026-08-01.md",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v3_README_2026-08-01.md",
      ...shotFramePaths,
    ],
    source_refs: [
      "frame_generation_queue.json",
      "production_system/reviews/local_identity_plates_2026-08-01/index.json",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/index.md",
      "production_system/reviews/local_video_source_frames_2026-08-01/index.json",
      "scripts/generate_ep03_composited_storyboard_frames.py",
    ],
    depends_on: [
      "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V2-2026-08-01",
    ],
    risk_flags: [
      "layout_reference_only",
      "not_approved_for_video",
      "deterministic_local_asset_composite",
      "matte_cleanup_required",
    ],
    notes: "V3 deterministic local selected.png composite layer. Improves opacity, group coverage, and scene fallback; remains a previs/layout reference.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "pipeline-gate-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "layout_reference",
    blocking_issues: [
      "V3 is deterministic local-asset compositing, not final cinematic cleanup or visual approval.",
      "Matte edges and source-plate integration remain approximate.",
    ],
    required_revisions: [
      "Use transparent cutouts, manual roto, or constrained cleanup before visual_review_passed.",
      "Run per-shot independent visual QA before any approved_for_video promotion.",
    ],
    rubric: {
      local_asset_usage: "pass",
      shot_coverage: missing.length ? "integrity_blocked" : "pass",
      group_coverage: "pass_for_shot007",
      cinematic_finish: "layout_reference",
      identity_preservation: "pass_as_source_asset_composite",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: [
      "generated_storyboard_contact_sheet.jpg",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v3_review_2026-08-01.md",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v3_README_2026-08-01.md",
      ...shotFramePaths,
    ],
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log(`recorded ${artifactId}: ${shotFramePaths.length}/108 frames, missing ${missing.length}`);
}

main();
