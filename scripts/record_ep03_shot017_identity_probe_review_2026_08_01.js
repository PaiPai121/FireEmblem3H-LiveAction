const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const identityReviewPath = `${epRoot}/production_system/identity_lock_review_2026-07-31.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;

const probe = {
  id: "Shot017_key_identity_locked_probe_2026-08-01",
  shot: "Shot017",
  frame_role: "key",
  decision: "blocked_needs_revision",
  generated_path: "storyboards/Shot017/key_frame_identity_locked_probe_2026-08-01.png",
  review_sheet: "production_system/reviews/shot017_identity_locked_probe_2026-08-01.jpg",
  review_markdown: "production_system/reviews/shot017_identity_locked_probe_review_2026-08-01.md",
  prompt_path: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/017_Shot017/key_frame_prompt.md",
  negative_prompt_path: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/017_Shot017/negative_prompt.md",
  local_asset_proof_sheet: "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot017_local_asset_previs_proof_2026-07-31.jpg",
  reason: "Probe improves battlefield composition and shield placement, but Ashe's face remains actor-like rather than proven against the local selected.png identity; Byleth face and hair silhouette also drift. Keep as blocked probe only.",
  required_revision: "Regenerate with stricter identity preservation, preferably character-specific identity plates or masked/local compositing before full cinematic integration.",
};

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
  const identityReview = readJson(identityReviewPath);
  identityReview.identity_probes = identityReview.identity_probes || {};
  identityReview.identity_probes[probe.id] = {
    path: probe.generated_path,
    review_sheet: probe.review_sheet,
    decision: probe.decision,
    reason: probe.reason,
  };
  identityReview.shots = identityReview.shots || {};
  identityReview.shots.Shot017 = {
    decision: "blocked_needs_revision",
    reason: probe.reason,
    latest_probe: probe.id,
  };
  writeJson(identityReviewPath, identityReview);

  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const artifactId = "EP03-Shot017-IDENTITY-LOCKED-KEY-PROBE-2026-08-01";
  const reviewId = "review-2026-08-01-Shot017-identity-locked-key-probe";

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "storyboard_frame",
    stage: "storyboard",
    status: "blocked_needs_revision",
    created_by: "imagegen-storyboard-agent",
    created_at: createdAt,
    paths: [probe.generated_path, probe.review_sheet, probe.review_markdown],
    source_refs: [
      probe.prompt_path,
      probe.negative_prompt_path,
      probe.local_asset_proof_sheet,
      "storyboards/Shot017/frame_spec.md",
      "production_system/identity_lock_review_2026-07-31.json",
    ],
    depends_on: [
      "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01",
      "EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31",
      "EP03-Shot017-FRAME-SPEC",
    ],
    continuity: {
      previous: "Shot016",
      next: "Shot018",
      in: "cut from Dimitri halt",
      out: "cut to Felix covering him",
    },
    risk_flags: ["local_asset_identity_drift", "face_drift", "blocked_probe_only"],
    notes: probe.reason,
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "asset-identity-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "blocked_needs_revision",
    blocking_issues: [
      "Ashe identity does not prove exact match to local selected.png; face reads as a new actor.",
      "Byleth face and hair silhouette drift from the local professor selected.png reference.",
      "The probe cannot replace Shot017 key_frame.png or enter video_generation_package.",
    ],
    required_revisions: [
      "Create stricter character-specific identity plates before integrated cinematic generation.",
      "Regenerate Shot017 key frame with stronger face/wardrobe preservation and compare against selected.png assets.",
    ],
    rubric: {
      local_asset_traceability: "conditional",
      face_identity: "fail",
      wardrobe_topology: "conditional",
      shot_composition: "improved",
      action_peak: "conditional",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: [probe.generated_path, probe.review_sheet, probe.review_markdown, probe.local_asset_proof_sheet],
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log(`recorded ${probe.id}`);
}

main();
