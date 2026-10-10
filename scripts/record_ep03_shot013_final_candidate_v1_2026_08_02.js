const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot013";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT013-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot013-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot013_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot013_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot013_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot013_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot013_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot012/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot013/Shot013_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot013_local_asset_previs_proof_2026-07-31.jpg",
      "production_system/reviews/identity_lock_comparison_2026-07-31/Shot013_identity_comparison_2026-07-31.jpg",
      "assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png",
      "storyboards/Shot013/start_frame.png",
      "storyboards/Shot013/key_frame.png",
      "storyboards/Shot013/end_frame.png",
    ],
    note: "Generated final candidate v1 from Shot012 tactical-halt continuity, local Shot013 evidence/proof, five-character identity comparison, Magdred fog road reference, and v3 layout. Still-frame chain passes as emotional halt, physical mud-map deployment, and first-arrow handoff. Downstream video remains monitor_required due to five-character identity density, dialogue timing, map/UI drift, and first-arrow anticipation risks.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot012 final end continuity + local Shot013 evidence/proof + identity comparison + Magdred fog road reference + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot013 final candidate v1 visibly proves the fog-deployment beat: start gathers Byleth, Dimitri, Ashe, Felix, and Mercedes into a tactical halt, key centers Byleth's physical mud sketch with stones for two routes, and end lifts to student faces while preserving the first-arrow cut-out without showing impact early.";
  shot.required_revision = "Before approved_for_video, rewrite the executable web prompt so it references only uploaded START/KEY/END frames, run dialogue-throughput QA for Byleth's line, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if the mud sketch becomes UI/grid/text, Ashe separates from the group, the arrow impact appears early, or any of the five academy identities drift.";
  shot.video_prompt_qa_decision = "pending_prompt_rewrite_and_review_against_final_candidate_v1";
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

  fs.writeFileSync(reviewMdPath, `# Shot013 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot012/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot013/Shot013_local_video_source_evidence_2026-08-01.jpg\`
- Local proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot013_local_asset_previs_proof_2026-07-31.jpg\`
- Identity comparison: \`production_system/reviews/identity_lock_comparison_2026-07-31/Shot013_identity_comparison_2026-07-31.jpg\`

## Visual Audit

Shot purpose: Byleth pulls the students back from emotion into tactics.

- Start frame: passes as the tactical halt after rebel-camp reconnaissance. The five-character grouping is readable and Ashe remains inside the team.
- Key frame: passes as the decisive action peak. Byleth's hand, mud route line, and stone groups are physical and non-UI.
- End frame: passes as edit handoff. The camera lifts to listening faces and offscreen fog eyelines without showing the first arrow early.
- Character identity: five-character density is high, so still-frame approval relies on local proof/identity boards, wardrobe topology, hair colors, and visible role placement rather than close-up face proof for every character.
- Frame chain: start/key/end are visually distinct and communicate gather, plan, and first-arrow anticipation states.

## Blocking Issues

No still-frame story/action blocker for Shot013 final candidate v1.

## Downstream Risks

- The mud sketch may drift into a tactical grid, glowing map, clean parchment, subtitles, or readable labels.
- Five named academy identities may drift under motion.
- Byleth's line is dialogue-heavy for an 18-second shot and needs timing QA.
- Ashe may be pushed forward alone by the model, breaking the shot purpose.
- The first arrow impact may appear before Shot014.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, run dialogue-throughput QA for Byleth's line, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if the physical mud-map, five-character identity locks, Ashe placement, no-UI/no-subtitle presentation, and first-arrow handoff survive the probe.
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
      "EP03-SHOT012-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: [
      "prompt_rewrite_required",
      "dialogue_timing_qa_required",
      "five_character_identity_monitor_required",
      "mud_map_ui_drift_monitor_required",
      "first_arrow_handoff_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot013 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      "Rewrite executable web prompt to reference only uploaded START/KEY/END frames.",
      "Run dialogue-throughput QA for Byleth's line.",
      "Run video-prompt QA against final candidate v1 actual frames.",
      "Run a 3-second motion probe before any approved_for_video promotion.",
    ],
    rubric: {
      story_beat: "pass",
      start_key_end_chain: "pass",
      local_identity_readability: "pass_for_group_scene",
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
  console.log("recorded Shot013 final candidate v1: visual_review_passed / monitor_required");
}

main();
