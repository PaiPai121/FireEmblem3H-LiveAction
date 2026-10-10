const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot003";
const createdAt = "2026-08-01";
const artifactId = "EP03-SHOT003-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-01";
const reviewId = "review-2026-08-01-shot003-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot003_local_asset_final_candidate_v1_review_2026-08-01.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot003_local_asset_final_candidate_v1_review_2026-08-01.jpg`;

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
    start: "storyboards/Shot003/local_asset_final_candidate_v1_2026-08-01/start_frame_local_asset_final_candidate_v1_2026-08-01.png",
    key: "storyboards/Shot003/local_asset_final_candidate_v1_2026-08-01/key_frame_local_asset_final_candidate_v1_2026-08-01.png",
    end: "storyboards/Shot003/local_asset_final_candidate_v1_2026-08-01/end_frame_local_asset_final_candidate_v1_2026-08-01.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot003_local_asset_final_candidate_v1_2026-08-01",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot003_local_asset_final_candidate_v1_review_2026-08-01.jpg",
    review_markdown: "production_system/reviews/shot003_local_asset_final_candidate_v1_review_2026-08-01.md",
    source_refs: [
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot003/Shot003_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Rhea_academy_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Seteth_academy_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg",
      "storyboards/Shot003/start_frame.png",
      "storyboards/Shot003/key_frame.png",
      "storyboards/Shot003/end_frame.png",
    ],
    note: "Generated final candidate v1 from local source evidence, four local identity plates, and v3 local selected.png previs. Still-frame hierarchy/story review passes; downstream video remains monitor_required due to group identity and subtle frame-chain motion risk.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "local source evidence + four local identity plates + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot003 final candidate v1 visibly proves the mission-briefing hierarchy: Rhea is elevated above the students, Seteth anchors Church authority at her side, Byleth and Dimitri are lower in the composition, and the key frame adds Rhea's formal declaration gesture.";
  shot.required_revision = "Before approved_for_video, run video-prompt QA against these actual frames, add a short motion probe, and reject if Rhea becomes villainous, Seteth ages/drifts, Byleth/Dimitri costumes drift, group blocking changes, or subtitles/UI appear.";
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
  if (!queueShot || !deliveryShot) throw new Error("Shot003 not found in queue or delivery manifest");
  applyShotStatus(queueShot);
  applyShotStatus(deliveryShot);

  fs.writeFileSync(reviewMdPath, `# Shot003 Local Asset Final Candidate V1 Review / 2026-08-01

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot003/Shot003_local_video_source_evidence_2026-08-01.jpg\`
- Identity plates: Rhea, Seteth, Byleth, Dimitri under \`production_system/reviews/local_identity_plates_2026-08-01/\`

## Visual Audit

Shot purpose: Rhea defines the Lonato rebellion as a Church crisis that must be suppressed.

- Start frame: passes as the pre-action briefing state. Rhea is placed above the student eyeline; Seteth stands in a controlled advisor role; Byleth and Dimitri are lower listeners.
- Key frame: passes as action peak. Rhea's raised hand/formal gesture gives the visible declaration beat.
- End frame: passes as a restrained cut-out state after the declaration, suitable for cutting on Ashe's name.
- Character identity: Rhea and Seteth are readable against local identity plates; Byleth and Dimitri are primarily back/wardrobe reads, which is acceptable for this shot size but high risk for downstream motion.
- Frame chain: frames are distinct enough for still-storyboard use, but the motion change is subtle and must be probed before video approval.

## Blocking Issues

No still-frame story/blocking blocker for Shot003 final candidate v1.

## Downstream Risks

- Rhea can become too villainous or over-commanding in video.
- Seteth may age or drift into generic noble robes.
- Byleth/Dimitri are back-view anchors; motion may invent faces or uniforms if the camera turns.
- The start/key/end difference is subtle, so a motion probe must confirm readable timing.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if identities, wardrobe topology, group hierarchy, no-UI/no-subtitle presentation, and restrained institutional tone survive the probe.
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
    risk_flags: ["group_identity_monitor_required", "not_approved_for_video", "motion_probe_required"],
    notes: "Shot003 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      start_key_end_chain: "pass_with_subtle_motion_monitor",
      local_identity_readability: "pass_for_still_frame",
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
  console.log("recorded Shot003 final candidate v1: visual_review_passed / monitor_required");
}

main();
