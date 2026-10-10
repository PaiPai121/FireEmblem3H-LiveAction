const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot006";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT006-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot006-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot006_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot006_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot006/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot006/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot006/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot006_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot006_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot006_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot006/Shot006_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg",
      "storyboards/Shot006/local_asset_locked_regen_v1_2026-08-01/key_frame_local_asset_locked_regen_v1_2026-08-01.png",
      "storyboards/Shot006/start_frame.png",
      "storyboards/Shot006/key_frame.png",
      "storyboards/Shot006/end_frame.png",
    ],
    note: "Generated final candidate v1 from local Ashe/Byleth/Dimitri identity plates, local source evidence, the classroom reference, and v3 layout reference. This supersedes the rejected close-up drift attempt. Still-frame chain passes; downstream video remains monitor_required because Ashe close-up identity, age, and restrained grief are high-risk.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "local Ashe identity plate + local source evidence + classroom reference + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot006 final candidate v1 visibly proves Ashe's old-debt confession: start gathers courage in side close-up, key shows the line landing with a restrained hand-to-uniform gesture, and end turns from grief into decision before the march-preparation cut.";
  shot.required_revision = "Before approved_for_video, run video-prompt QA against these actual frames, add a 3-second close-up motion probe, and reject if Ashe becomes older/generic, overacts grief, loses academy-uniform topology, or if Byleth/Dimitri sharpen enough to steal focus.";
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

  fs.writeFileSync(reviewMdPath, `# Shot006 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot006/Shot006_local_video_source_evidence_2026-08-01.jpg\`
- Identity plates: Ashe, Byleth, Dimitri under \`production_system/reviews/local_identity_plates_2026-08-01/\`
- Superseded rejected close-up: \`storyboards/Shot006/local_asset_locked_regen_v1_2026-08-01/key_frame_local_asset_locked_regen_v1_2026-08-01.png\`

## Visual Audit

Shot purpose: Ashe chooses to face the mission instead of being protected outside the group.

- Start frame: passes as pre-action. Ashe holds a restrained side close-up and gathers himself before speaking.
- Key frame: passes as action peak. Ashe's hand-to-uniform gesture and window eyeline make the old-debt confession readable without melodrama.
- End frame: passes as edit handoff. Ashe turns from memory into decision, supporting the cut to march preparation.
- Character identity: this version improves on the rejected close-up drift attempt and keeps youthful silver-blond Ashe plus the black/tan academy-uniform topology. The face remains high-risk for video because Shot006 is a close-up.
- Frame chain: start/key/end are visually distinct and communicate beginning, peak, and cut-out state.

## Blocking Issues

No still-frame story/action blocker for Shot006 final candidate v1.

## Downstream Risks

- Ashe may age up or become a generic blond lead in motion.
- The confession can overact into tears or melodrama.
- The academy hood/lacing/tan panel topology may drift under motion.
- Byleth and Dimitri should remain secondary and soft, not sharpen into focus.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second close-up motion probe, and only promote to \`approved_for_video\` if Ashe identity/age/uniform, restrained acting, secondary listener focus, and no-UI/no-subtitle presentation survive the probe.
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
      "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
    ],
    risk_flags: ["ashe_closeup_identity_monitor_required", "melodrama_monitor_required", "not_approved_for_video", "motion_probe_required"],
    notes: "Shot006 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      "Run a 3-second close-up motion probe before any approved_for_video promotion.",
    ],
    rubric: {
      story_beat: "pass",
      start_key_end_chain: "pass",
      local_identity_readability: "pass_for_still_frame_high_risk_closeup",
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
  console.log("recorded Shot006 final candidate v1: visual_review_passed / monitor_required");
}

main();
