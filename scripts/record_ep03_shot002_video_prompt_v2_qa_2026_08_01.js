const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const deliveryManifestPath = `${epRoot}/production_system/video_delivery_manifest.json`;

const qa = {
  artifactId: "EP03-Shot002-VIDEO-PROMPT-V2-QA-2026-08-01",
  reviewId: "review-2026-08-01-Shot002-video-prompt-v2-qa",
  decision: "monitor_required",
  paths: [
    "production_system/reviews/shot002_video_prompt_v2_qa_2026-08-01.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/video_prompt_v2_2026-08-01.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/negative_prompt_v2_2026-08-01.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/motion_probe_plan_v2_2026-08-01.md",
  ],
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
  const delivery = readJson(deliveryManifestPath);
  const shot = (delivery.shots || []).find((item) => item.id === "Shot002");
  if (shot) {
    shot.video_prompt_qa_decision = qa.decision;
    shot.motion_probe_status = "probe_pending";
    shot.motion_probe_plan = "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/motion_probe_plan_v2_2026-08-01.md";
    shot.video_prompt_v2 = "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/video_prompt_v2_2026-08-01.md";
    shot.negative_prompt_v2 = "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/negative_prompt_v2_2026-08-01.md";
    shot.required_revision = "Run a 3-second motion probe and adjacent continuity review with Shot001/Shot003 before approved_for_video.";
  }
  writeJson(deliveryManifestPath, delivery);

  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);

  upsertBy(artifacts.artifacts, "id", {
    id: qa.artifactId,
    type: "video_prompt_review",
    stage: "video_prompt",
    status: qa.decision,
    created_by: "video-prompt-qa-agent",
    created_at: createdAt,
    paths: qa.paths,
    source_refs: [
      "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/metadata.json",
      "production_system/reviews/shot002_identity_locked_regen_v2_review_2026-08-01.md",
      "production_system/video_delivery_manifest.json",
    ],
    depends_on: [
      "EP03-Shot002-IDENTITY-LOCKED-REGEN-V2-FRAMESET-2026-08-01",
      "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01",
    ],
    continuity: {
      previous: "Shot001",
      next: "Shot003",
      in: "cut from dream eye closeup",
      out: "match cut to council doors",
    },
    risk_flags: ["motion_probe_required", "adjacent_continuity_required", "not_approved_for_video"],
    notes: "Shot002 v2 video prompt is structurally valid and usable for a 3-second motion probe, but full video approval requires probe QA and adjacent continuity.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: qa.artifactId,
    review_id: qa.reviewId,
    reviewer_role: "video-prompt-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: qa.decision,
    blocking_issues: [
      "No generated motion probe or final clip exists yet.",
      "Adjacent continuity with Shot001 and Shot003 is not approved because those revised frame sets are still missing or blocked.",
    ],
    required_revisions: [
      "Generate the 3-second motion probe.",
      "Audit Byleth silhouette, wardrobe topology, corridor axis, no added named characters, and no UI/text in the probe.",
      "Run adjacent continuity after Shot001 and Shot003 revised frame sets exist.",
    ],
    rubric: {
      prompt_contract: "pass",
      input_frame_locks: "pass",
      motion_specificity: "pass",
      camera_guardrails: "pass",
      negative_prompt: "pass",
      video_readiness: "monitor_required",
    },
    reviewed_paths: qa.paths,
  });

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log(`recorded ${qa.reviewId}`);
}

main();
