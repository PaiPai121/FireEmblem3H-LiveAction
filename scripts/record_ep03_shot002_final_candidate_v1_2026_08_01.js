const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot002";
const createdAt = "2026-08-01";
const artifactId = "EP03-SHOT002-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-01";
const reviewId = "review-2026-08-01-shot002-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot002_local_asset_final_candidate_v1_review_2026-08-01.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot002_local_asset_final_candidate_v1_review_2026-08-01.jpg`;

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

function candidateFrames() {
  return {
    start: "storyboards/Shot002/local_asset_final_candidate_v1_2026-08-01/start_frame_local_asset_final_candidate_v1_2026-08-01.png",
    key: "storyboards/Shot002/local_asset_final_candidate_v1_2026-08-01/key_frame_local_asset_final_candidate_v1_2026-08-01.png",
    end: "storyboards/Shot002/local_asset_final_candidate_v1_2026-08-01/end_frame_local_asset_final_candidate_v1_2026-08-01.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot002_local_asset_final_candidate_v1_2026-08-01",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: candidateFrames(),
    review_sheet: "production_system/reviews/shot002_local_asset_final_candidate_v1_review_2026-08-01.jpg",
    review_markdown: "production_system/reviews/shot002_local_asset_final_candidate_v1_review_2026-08-01.md",
    source_refs: [
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot002/Shot002_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
      "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
      "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
      "storyboards/Shot002/start_frame.png",
      "storyboards/Shot002/key_frame.png",
      "storyboards/Shot002/end_frame.png",
    ],
    note: "Generated final candidate v1 from local Byleth identity, local monastery/crest assets, local timing context, and v3 local selected.png previs. Still-frame story/geography review passes; downstream video remains monitor_required.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "local identity plates + local monastery assets + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot002 final candidate v1 visibly establishes Garreg Mach morning order: start gives the cloister and bell atmosphere, key shows Church/students gathering in the corridor, and end turns Byleth toward the council-door match cut. Byleth remains readable against the local identity plate.";
  shot.required_revision = "Before approved_for_video, run video-prompt QA against these actual frames, add a short motion probe, and reject if Byleth identity, professor wardrobe topology, monastery geography, no-UI/no-subtitle presentation, or restrained motion drifts.";
  shot.video_prompt_qa_decision = "pending_review_against_final_candidate_v1";
  shot.motion_probe_status = "pending_3s_probe";
}

function main() {
  const queue = readJson(queuePath);
  const delivery = readJson(deliveryPath);
  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const frames = candidateFrames();
  const missing = Object.values(frames).filter((frame) => !fs.existsSync(`${epRoot}/${frame}`));
  if (missing.length) throw new Error(`missing candidate frames: ${missing.join(", ")}`);

  const queueShot = (queue.shots || []).find((shot) => shot.id === shotId);
  const deliveryShot = (delivery.shots || []).find((shot) => shot.id === shotId);
  if (!queueShot || !deliveryShot) throw new Error("Shot002 not found in queue or delivery manifest");
  applyShotStatus(queueShot);
  applyShotStatus(deliveryShot);

  fs.writeFileSync(reviewMdPath, `# Shot002 Local Asset Final Candidate V1 Review / 2026-08-01

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${frames.start}\`
- Key: \`${frames.key}\`
- End: \`${frames.end}\`
- Source timing/context evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot002/Shot002_local_video_source_evidence_2026-08-01.jpg\`
- Byleth identity plate: \`production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg\`

## Visual Audit

Shot purpose: establish the shift from academy routine into Church military command.

- Start frame: passes as morning cloister establishing state with readable architecture, banners, mist, and Byleth.
- Key frame: passes as the action peak for gathering order; distant knights/students add military pressure without introducing named-character confusion.
- End frame: passes as a match-cut handoff toward council doors; Byleth has turned and the corridor direction is readable.
- Character identity: passes for still-frame readability against local Byleth plate, with residual downstream drift risk.
- Frame chain: start/key/end are visually distinct; no duplicate-anchor issue.

## Blocking Issues

No still-frame story/geography blocker for Shot002 final candidate v1.

## Downstream Risks

- Byleth face/wardrobe may drift in video, especially during turn/walk motion.
- Background knights/students may become named-looking or over-detailed.
- Model may add generic fantasy armor, subtitles, or UI unless negative prompt is tightened against these frames.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if Byleth identity, professor wardrobe topology, monastery geography, no-UI/no-subtitle presentation, and restrained motion continuity survive the probe.
`);

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "storyboard_frame_set",
    stage: "storyboard",
    status: "monitor_required",
    created_by: "identity-preserve-imagegen-cleanup-agent",
    created_at: createdAt,
    paths: [
      frames.start,
      frames.key,
      frames.end,
      reviewSheetPath.replace(`${epRoot}/`, ""),
      reviewMdPath.replace(`${epRoot}/`, ""),
    ],
    source_refs: frameSet().source_refs,
    depends_on: [
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
      "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
    ],
    risk_flags: ["image_to_video_identity_monitor_required", "not_approved_for_video", "motion_probe_required"],
    notes: "Shot002 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      frames.start,
      frames.key,
      frames.end,
      reviewSheetPath.replace(`${epRoot}/`, ""),
      reviewMdPath.replace(`${epRoot}/`, ""),
    ],
  });

  writeJson(queuePath, queue);
  writeJson(deliveryPath, delivery);
  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log("recorded Shot002 final candidate v1: visual_review_passed / monitor_required");
}

main();
