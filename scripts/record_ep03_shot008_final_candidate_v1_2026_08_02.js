const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot008";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT008-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot008-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot008_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot008_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot008/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot008/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot008/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot008_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot008_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot008_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot008/Shot008_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_church_of_seiros_Catherine_academy_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg",
      "assets/props/shared/hero_relics/hero_relics_reference.png",
      "storyboards/Shot008/start_frame.png",
      "storyboards/Shot008/key_frame.png",
      "storyboards/Shot008/end_frame.png",
    ],
    note: "Generated final candidate v1 from local Catherine/Byleth/Ashe identity plates, local Shot008 source evidence, hero relic prop reference, and v3 layout reference. Still-frame chain passes as Catherine joining the prepared line; downstream video remains monitor_required due to Catherine age/authority, background extra, and hero relic glow/drift risk.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "local Catherine/Byleth/Ashe identity plates + local source evidence + hero relic reference + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot008 final candidate v1 visibly proves Catherine joining the line: start introduces her as an adult church knight opposite the prepared students, key shows her crossing through the line with calm authority, and end lands on Ashe recognizing her certainty before the next cut.";
  shot.required_revision = "Before approved_for_video, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Catherine becomes student-like, her armor is redesigned, the hero relic becomes a glowing weapon ad, background extras multiply, or Ashe/Byleth identities drift.";
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

  fs.writeFileSync(reviewMdPath, `# Shot008 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot008/Shot008_local_video_source_evidence_2026-08-01.jpg\`
- Identity plates: Catherine, Byleth, Ashe under \`production_system/reviews/local_identity_plates_2026-08-01/\`
- Prop reference: \`assets/props/shared/hero_relics/hero_relics_reference.png\`

## Visual Audit

Shot purpose: introduce the real scale of Church force and contrast Catherine's certainty with the students' unfamiliarity.

- Start frame: passes as entrance setup. Catherine reads as an adult church knight facing the prepared line; Byleth and Ashe are present as secondary observers. The background line is a monitor risk but not a still-frame blocker.
- Key frame: passes as action peak. Catherine crosses through the students with calm authority; Byleth and Ashe remain secondary, and the weapon does not become a glowing hero-shot.
- End frame: passes as edit handoff. Catherine leads while Ashe becomes the reaction read for the next cut.
- Character identity: Catherine is aligned with the local plate as adult blonde knight in white armor. Byleth and Ashe are readable enough for secondary roles.
- Frame chain: start/key/end are visually distinct and communicate beginning, peak, and cut-out state.

## Blocking Issues

No still-frame story/action blocker for Shot008 final candidate v1.

## Downstream Risks

- Catherine can drift younger/student-like or into redesigned glamour armor.
- Hero relic/Thunderbrand can start glowing or become oversized.
- Background students can multiply or sharpen into generic extras.
- Ashe's reaction can drift older or lose Blue Lions academy topology.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if Catherine identity/age/armor, subdued covered-weapon presentation, Ashe reaction, limited extras, and no-UI/no-subtitle presentation survive the probe.
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
    risk_flags: ["catherine_identity_age_monitor_required", "hero_relic_glow_monitor_required", "background_extras_monitor_required", "not_approved_for_video", "motion_probe_required"],
    notes: "Shot008 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
  console.log("recorded Shot008 final candidate v1: visual_review_passed / monitor_required");
}

main();
