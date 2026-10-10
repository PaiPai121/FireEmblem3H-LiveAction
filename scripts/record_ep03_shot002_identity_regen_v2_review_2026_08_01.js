const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const identityReviewPath = `${epRoot}/production_system/identity_lock_review_2026-07-31.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const deliveryManifestPath = `${epRoot}/production_system/video_delivery_manifest.json`;

const frameSet = {
  id: "Shot002_identity_locked_regen_v2_frameset_2026-08-01",
  shot: "Shot002",
  decision: "visual_review_passed",
  frames: {
    start: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/start_frame_identity_locked_regen_v2_2026-08-01.png",
    key: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/key_frame_identity_locked_regen_v2_2026-08-01.png",
    end: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/end_frame_identity_locked_regen_v2_2026-08-01.png",
  },
  supersedes: "Shot002_identity_locked_regen_frameset_2026-08-01",
  review_sheet: "production_system/reviews/shot002_identity_locked_regen_v2_review_2026-08-01.jpg",
  review_markdown: "production_system/reviews/shot002_identity_locked_regen_v2_review_2026-08-01.md",
  prompt_paths: [
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/start_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/key_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/end_frame_prompt.md",
  ],
  negative_prompt_path: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/negative_prompt.md",
  local_asset_proof_sheet: "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot002_local_asset_previs_proof_2026-07-31.jpg",
  reason: "V2 reframes Shot002 as a wide establishing shot, carrying Byleth identity through local black-hair silhouette and professor wardrobe topology while clarifying the enter/pause/turn frame chain.",
  required_revision: "Before approved_for_video, run prompt-against-frame QA, motion-risk review, and adjacent continuity against Shot001 and Shot003.",
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
    supersedes: frameSet.supersedes,
    review_sheet: frameSet.review_sheet,
    review_markdown: frameSet.review_markdown,
    decision: frameSet.decision,
    reason: frameSet.reason,
  };
  identityReview.shots = identityReview.shots || {};
  identityReview.shots.Shot002 = {
    decision: frameSet.decision,
    reason: frameSet.reason,
    latest_regeneration_frame_set: frameSet.id,
  };
  writeJson(identityReviewPath, identityReview);

  const delivery = readJson(deliveryManifestPath);
  const shot = (delivery.shots || []).find((item) => item.id === "Shot002");
  if (shot) {
    shot.status = "visual_review_passed";
    shot.visual_audit_decision = "visual_review_passed";
    shot.visual_audit_finding = frameSet.reason;
    shot.required_revision = frameSet.required_revision;
    shot.regenerated_frames = frameSet.frames;
  }
  writeJson(deliveryManifestPath, delivery);

  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const artifactId = "EP03-Shot002-IDENTITY-LOCKED-REGEN-V2-FRAMESET-2026-08-01";
  const reviewId = "review-2026-08-01-Shot002-identity-locked-regen-v2-frameset";
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
    status: "visual_review_passed",
    created_by: "imagegen-storyboard-agent",
    created_at: createdAt,
    paths: reviewedPaths,
    source_refs: [
      ...frameSet.prompt_paths,
      frameSet.negative_prompt_path,
      "storyboards/Shot002/frame_spec.md",
      "production_system/reviews/local_identity_plates_2026-08-01/index.json",
      "production_system/identity_lock_review_2026-07-31.json",
    ],
    depends_on: [
      "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01",
      "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
      "EP03-LOCAL-ASSET-PREVIS-PROOF-SHEETS-2026-07-31",
      "EP03-Shot002-FRAME-SPEC",
    ],
    continuity: {
      previous: "Shot001",
      next: "Shot003",
      in: "cut from dream eye closeup",
      out: "match cut to council doors",
    },
    risk_flags: ["motion_qa_required", "adjacent_continuity_required", "not_approved_for_video"],
    notes: frameSet.reason,
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "asset-identity-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "visual_review_passed",
    blocking_issues: [
      "No shot-level visual blocker remains for this wide establishing still-frame set.",
      "Video approval is still blocked by missing prompt-against-frame QA, motion-risk review, and adjacent continuity.",
    ],
    required_revisions: [
      "Run video-prompt QA against the v2 frames.",
      "Run continuity review against Shot001 and Shot003 once their revised frames exist.",
      "Keep Shot002 out of approved_for_video until those downstream gates pass.",
    ],
    rubric: {
      local_asset_traceability: "pass",
      location_quality: "pass",
      wardrobe_topology: "pass",
      face_identity: "pass_for_wide_silhouette_framing",
      frame_chain: "pass",
      visual_readiness: "visual_review_passed",
      video_readiness: "monitor_required",
    },
    reviewed_paths: reviewedPaths,
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log(`recorded ${frameSet.id}`);
}

main();
