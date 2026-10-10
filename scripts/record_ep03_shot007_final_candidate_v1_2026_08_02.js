const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot007";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT007-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot007-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot007_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot007_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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

function frames() {
  return {
    start: "storyboards/Shot007/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot007/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot007/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot007_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot007_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot007_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot007/Shot007_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot007_local_asset_previs_proof_2026-07-31.jpg",
      "assets/props/EP02/training_weapons/training_weapons_reference.png",
      "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
      "storyboards/Shot007/start_frame.png",
      "storyboards/Shot007/key_frame.png",
      "storyboards/Shot007/end_frame.png",
    ],
    note: "Generated final candidate v1 as a preparation montage insert from local Shot007 evidence, local character/prop proof, weapons, flags, and v3 layout reference. Still-frame chain passes as departure preparation; downstream video remains monitor_required due to multi-character identity, prop, and modern-weapon drift risk.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "local Shot007 evidence board + local character/prop proof + weapons/flags references + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot007 final candidate v1 visibly proves the departure-preparation montage: start establishes weapons/flags/lanterns and students entering, key isolates hands/straps/lanterns/weapons, and end lands on the prepared Blue Lions line before Catherine's entrance.";
  shot.required_revision = "Before approved_for_video, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if the montage introduces modern weapons, gore, war-phase armor, readable UI/text, or sharp close-up faces that drift from local assets.";
  shot.video_prompt_qa_decision = "pending_review_against_final_candidate_v1";
  shot.motion_probe_status = "pending_3s_probe";
}

function main() {
  const queue = readJson(queuePath);
  const delivery = readJson(deliveryPath);
  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const currentFrames = frames();
  const missing = Object.values(currentFrames).filter((frame) => !fs.existsSync(`${epRoot}/${frame}`));
  if (missing.length) throw new Error(`missing candidate frames: ${missing.join(", ")}`);

  const queueShot = (queue.shots || []).find((shot) => shot.id === shotId);
  const deliveryShot = (delivery.shots || []).find((shot) => shot.id === shotId);
  if (!queueShot || !deliveryShot) throw new Error(`${shotId} not found in queue or delivery manifest`);
  applyShotStatus(queueShot);
  applyShotStatus(deliveryShot);

  fs.writeFileSync(reviewMdPath, `# Shot007 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot007/Shot007_local_video_source_evidence_2026-08-01.jpg\`
- Local character/prop proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot007_local_asset_previs_proof_2026-07-31.jpg\`
- Prop plates: training weapons and Church of Seiros crest flags.

## Visual Audit

Shot purpose: show that this is the students' first real suppression mission, not ordinary training.

- Start frame: passes as a preparation-establishing insert. Weapons, flags, fog lamps, and Blue Lions students enter the staging space without becoming a risky face lineup.
- Key frame: passes as action peak. Hands, straps, lantern, shields, weapons, and uniform details make the preparation beat readable.
- End frame: passes as edit handoff. The students are equipped and aligned toward the gate, leaving a clear visual opening for Catherine's entrance.
- Character identity: the montage strategy keeps faces secondary/partial and relies on local uniform silhouettes and prop plates, which is the safer visual choice for this group shot.
- Frame chain: start/key/end are visually distinct and communicate beginning, peak, and cut-out state.

## Blocking Issues

No still-frame story/action blocker for Shot007 final candidate v1.

## Downstream Risks

- Multi-character faces may sharpen and drift in video.
- Weapons may morph into modern firearms or fantasy glowing props.
- Academy uniforms may become war-phase armor.
- The montage could become too heroic or violent instead of quiet duty.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if prop topology, academy uniforms, subdued performance, no-UI/no-text presentation, and montage readability survive the probe.
`);

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "storyboard_frame_set",
    stage: "storyboard",
    status: "monitor_required",
    created_by: "identity-preserve-imagegen-cleanup-agent",
    created_at: createdAt,
    paths: [
      currentFrames.start,
      currentFrames.key,
      currentFrames.end,
      reviewSheetPath.replace(`${epRoot}/`, ""),
      reviewMdPath.replace(`${epRoot}/`, ""),
    ],
    source_refs: frameSet().source_refs,
    depends_on: [
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
      "EP03-LOCAL-ASSET-PREVIS-PROOF-2026-07-31",
    ],
    risk_flags: ["multi_character_identity_monitor_required", "modern_weapon_monitor_required", "not_approved_for_video", "motion_probe_required"],
    notes: "Shot007 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "independent-storyboard-visual-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "visual_review_passed",
    blocking_issues: [],
    required_revisions: [
      "Run video-prompt QA against final candidate v1 actual frames.",
      "Run a 3-second motion probe before any approved_for_video promotion.",
    ],
    rubric: {
      story_beat: "pass",
      start_key_end_chain: "pass",
      local_identity_readability: "pass_for_insert_montage",
      local_asset_traceability: "pass",
      video_readiness: "monitor_required",
    },
    reviewed_paths: [
      currentFrames.start,
      currentFrames.key,
      currentFrames.end,
      reviewSheetPath.replace(`${epRoot}/`, ""),
      reviewMdPath.replace(`${epRoot}/`, ""),
    ],
  });

  writeJson(queuePath, queue);
  writeJson(deliveryPath, delivery);
  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log("recorded Shot007 final candidate v1: visual_review_passed / monitor_required");
}

main();
