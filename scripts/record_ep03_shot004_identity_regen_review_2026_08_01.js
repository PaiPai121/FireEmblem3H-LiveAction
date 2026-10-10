const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const identityReviewPath = `${epRoot}/production_system/identity_lock_review_2026-07-31.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;

const frameSet = {
  id: "Shot004_identity_locked_regen_frameset_2026-08-01",
  shot: "Shot004",
  decision: "blocked_needs_revision",
  frames: {
    start: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/start_frame_identity_locked_regen_2026-08-01.png",
    key: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/key_frame_identity_locked_regen_2026-08-01.png",
    end: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/end_frame_identity_locked_regen_2026-08-01.png",
  },
  review_sheet: "production_system/reviews/shot004_identity_locked_regen_review_2026-08-01.jpg",
  review_markdown: "production_system/reviews/shot004_identity_locked_regen_review_2026-08-01.md",
  prompt_paths: [
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/start_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/key_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/end_frame_prompt.md",
  ],
  negative_prompt_path: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/negative_prompt.md",
  local_asset_proof_sheet: "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot004_local_asset_previs_proof_2026-07-31.jpg",
  reason: "The full Shot004 start/key/end regeneration improves costume topology, bow continuity, cathedral lighting, and restrained performance, but Ashe's face/age read and Byleth background identity remain insufficiently proven against local selected.png identity plates.",
  required_revision: "Regenerate with stricter Ashe face preservation and either stronger or more distant Byleth/Dimitri staging; keep the useful cathedral setup and bow continuity.",
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
  identityReview.identity_regeneration_frame_sets = identityReview.identity_regeneration_frame_sets || {};
  identityReview.identity_regeneration_frame_sets[frameSet.id] = {
    frames: frameSet.frames,
    review_sheet: frameSet.review_sheet,
    review_markdown: frameSet.review_markdown,
    decision: frameSet.decision,
    reason: frameSet.reason,
  };
  identityReview.shots = identityReview.shots || {};
  identityReview.shots.Shot004 = {
    decision: frameSet.decision,
    reason: frameSet.reason,
    latest_regeneration_frame_set: frameSet.id,
  };
  writeJson(identityReviewPath, identityReview);

  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const artifactId = "EP03-Shot004-IDENTITY-LOCKED-REGEN-FRAMESET-2026-08-01";
  const reviewId = "review-2026-08-01-Shot004-identity-locked-regen-frameset";
  const reviewedPaths = [
    frameSet.frames.start,
    frameSet.frames.key,
    frameSet.frames.end,
    frameSet.review_sheet,
    frameSet.review_markdown,
    frameSet.local_asset_proof_sheet,
  ];

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "storyboard_frame_set",
    stage: "storyboard",
    status: "blocked_needs_revision",
    created_by: "imagegen-storyboard-agent",
    created_at: createdAt,
    paths: reviewedPaths,
    source_refs: [
      ...frameSet.prompt_paths,
      frameSet.negative_prompt_path,
      "storyboards/Shot004/frame_spec.md",
      "production_system/reviews/local_identity_plates_2026-08-01/index.json",
      "production_system/identity_lock_review_2026-07-31.json",
    ],
    depends_on: [
      "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01",
      "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
      "EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31",
      "EP03-Shot004-FRAME-SPEC",
    ],
    continuity: {
      previous: "Shot003",
      next: "Shot005",
      in: "cut from Rhea order",
      out: "cut to Ashe avoiding the class gaze",
    },
    risk_flags: ["face_identity_not_strict", "background_identity_ambiguous", "blocked_frameset_only"],
    notes: frameSet.reason,
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "asset-identity-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "blocked_needs_revision",
    blocking_issues: [
      "Ashe's wardrobe topology and bow continuity improve, but his face and academy-age read are still not strict enough against the local identity plate.",
      "Byleth remains background-readable only and does not prove exact local professor selected.png preservation.",
      "Start/key emotional differentiation remains too subtle for final video anchoring.",
      "The frame set cannot replace local previs or enter video_generation_package.",
    ],
    required_revisions: [
      "Regenerate Shot004 with stricter Ashe face preservation and younger academy read.",
      "Either sharpen Byleth/Dimitri identity or stage them farther back as clearly secondary figures.",
      "Increase start/key/end emotional distinction while preserving axis, wardrobe, bow, and cathedral layout.",
    ],
    rubric: {
      local_asset_traceability: "pass",
      wardrobe_topology: "conditional",
      face_identity: "fail",
      frame_chain: "conditional",
      story_beat: "conditional",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: reviewedPaths,
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log(`recorded ${frameSet.id}`);
}

main();
