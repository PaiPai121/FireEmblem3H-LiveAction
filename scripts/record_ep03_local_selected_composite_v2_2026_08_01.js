const fs = require("fs");
const path = require("path");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const artifactId = "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V2-2026-08-01";
const reviewId = "review-2026-08-01-ep03-local-selected-png-composited-previs-v2";
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const queuePath = `${epRoot}/frame_generation_queue.json`;
const reviewPath = `${epRoot}/production_system/reviews/ep03_local_selected_png_composited_previs_v2_review_2026-08-01.md`;
const readmePath = `${epRoot}/production_system/reviews/ep03_local_selected_png_composited_previs_v2_README_2026-08-01.md`;

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
      const full = path.join(epRoot, framePath);
      if (fs.existsSync(full)) shotFramePaths.push(framePath);
      else missing.push(framePath);
    }
    shot.local_selected_png_composited_previs_v2 = {
      frame_set_id: `${shot.id}_local_selected_png_composited_previs_v2_2026-08-01`,
      status: "layout_reference",
      frames,
      review_markdown: "production_system/reviews/ep03_local_selected_png_composited_previs_v2_review_2026-08-01.md",
      note: "Deterministic composite from local selected.png character assets. This proves local asset usage but is not final cinematic visual approval.",
    };
  }

  const review = `# EP03 Local Selected.png Composited Previs V2 Review / 2026-08-01

Reviewer role: pipeline-gate-qa-agent
Decision: layout_reference

## Coverage

- Shots covered: ${(queue.shots || []).length}/36
- Frame files covered: ${shotFramePaths.length}/108
- Missing frame files: ${missing.length}
- Contact sheet: \`generated_storyboard_contact_sheet.jpg\`
- Generator: \`scripts/generate_ep03_composited_storyboard_frames.py\`

## Finding

V2 uses local \`selected.png\` character assets deterministically, so it corrects the prior failure where generated images only looked generally like Fire Emblem characters. The visible characters now come from the project asset library rather than from free AI reinterpretation.

The frame set is still a previs/proof layer. The character assets are source images with baked-in backgrounds, and the deterministic matte is not a final cinematic roto. Some weapons, hair edges, and feet are approximate. Therefore V2 may be used for local identity proof, blocking, shot order, prompt review, and web presentation, but it must not be promoted to \`visual_review_passed\` or \`approved_for_video\` without a later cinematic cleanup/QA pass.

## Required Revision

Build final per-shot keyframes from the V2 local-selected composite layer using either real transparent cutouts, manual roto, or a strictly constrained image-to-image pass that preserves the local selected.png face, age, hair, body, costume topology, and named-role identity.
`;

  const readme = `# EP03 Local Selected.png Composite V2

This is the current honest local-asset layer for EP3.

It is useful because every shot has start/key/end frames built from local project assets, not random generated character faces. It is limited because the source character assets are not transparent cutouts, so the result is a proof/previs layer rather than finished cinematic key art.

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
      "production_system/reviews/ep03_local_selected_png_composited_previs_v2_review_2026-08-01.md",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v2_README_2026-08-01.md",
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
    ],
    risk_flags: [
      "layout_reference_only",
      "not_approved_for_video",
      "deterministic_local_asset_composite",
      "source_character_assets_have_baked_backgrounds",
    ],
    notes: "V2 deterministic local selected.png composite layer. Proves local asset usage for all EP03 shots but remains a previs/layout reference.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "pipeline-gate-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "layout_reference",
    blocking_issues: [
      "V2 is deterministic local-asset compositing, not final cinematic roto or visual approval.",
      "Source character assets contain baked-in backgrounds; matte edges remain approximate.",
    ],
    required_revisions: [
      "Use transparent cutouts, manual roto, or constrained image-to-image cleanup before visual_review_passed.",
      "Run per-shot independent visual QA before any approved_for_video promotion.",
    ],
    rubric: {
      local_asset_usage: "pass",
      shot_coverage: missing.length ? "integrity_blocked" : "pass",
      cinematic_finish: "layout_reference",
      identity_preservation: "pass_as_source_asset_composite",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: [
      "generated_storyboard_contact_sheet.jpg",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v2_review_2026-08-01.md",
      "production_system/reviews/ep03_local_selected_png_composited_previs_v2_README_2026-08-01.md",
      ...shotFramePaths,
    ],
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log(`recorded ${artifactId}: ${shotFramePaths.length}/108 frames, missing ${missing.length}`);
}

main();
