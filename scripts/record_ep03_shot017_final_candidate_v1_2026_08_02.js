const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot017";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT017-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot017-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot017_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot017_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot017/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot017/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot017/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot017_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot017_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot017_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot017/Shot017_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot017_local_asset_previs_proof_2026-07-31.jpg",
      "production_system/reviews/identity_lock_comparison_2026-07-31/Shot017_identity_comparison_2026-07-31.jpg",
      "assets/characters/blue_lions/Ashe/academy/selected.png",
      "assets/characters/protagonist/Byleth/professor/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot017/start_frame.png",
      "storyboards/Shot017/key_frame.png",
      "storyboards/Shot017/end_frame.png",
    ],
    note: "Generated final candidate v1 from local Ashe/Byleth identity plates, Shot017 local video evidence, local asset proof, battlefield ridge, and Shot016 end continuity. Still-frame chain passes as draw, recognition of a non-text old Gaspard-style crest, and slackened-bow hesitation. Downstream video remains monitor_required due to prompt contamination, crest misread risk, helplessness-overhold risk, and dialogue timing/tail-hold risk.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot016 final end continuity + local Shot017 video evidence/proof + Ashe/Byleth identity references + battlefield ridge reference + constrained imagegen final candidate";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot017 final candidate v1 visibly proves Ashe's recognition beat: start establishes hand/string tension and the shield entering attention, key clarifies the shield crest and Ashe's hesitation, and end lands on his slackened bow with Byleth witnessing, ready to cut to Felix covering him.";
  shot.required_revision = "Before approved_for_video, rewrite the executable web prompt to remove unrelated Rhea/Catherine locks and reference only uploaded START/KEY/END frames, run dialogue timing/tail-hold QA for Ashe's line, run crest readability QA, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Ashe fires, freezes helplessly for the whole shot, the crest becomes readable text or a Seiros/Blue Lions mark, Byleth disappears, or UI/subtitles appear.";
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

  fs.writeFileSync(reviewMdPath, `# Shot017 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot017/Shot017_local_video_source_evidence_2026-08-01.jpg\`
- Local proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot017_local_asset_previs_proof_2026-07-31.jpg\`

## Visual Audit

Shot purpose: push the battle pressure back onto Ashe's choice by making him recognize the Gaspard connection.

- Start frame: passes as a close bow-hand/eye setup. Ashe is aiming, but the shield crest has entered his attention.
- Key frame: passes as the recognition peak. The bowstring and Ashe's expression soften while the weathered crest becomes the visual cause of hesitation.
- End frame: passes as the cut-out state. Ashe's bow is lowered/slackened and Byleth is present as witness, allowing the next cut to Felix covering him.
- Character identity: Ashe and Byleth are traceable to local academy/professor identity plates, though Ashe facial consistency remains a motion-risk watch item.
- Frame chain: start/key/end are visually distinct and communicate draw, recognition, and hesitation states.

## Blocking Issues

No still-frame story/action blocker for Shot017 final candidate v1.

## Downstream Risks

- Current executable prompt contains unrelated Rhea/Catherine/Lonato locks and must be rewritten before video submission.
- The shield crest may drift into readable text, a Church of Seiros emblem, or a Blue Lions mark.
- Ashe may either fire the arrow or freeze helplessly for the full duration.
- 16 seconds is long for one recognition line unless the prompt controls eye/hand timing and the tail hold.
- Byleth may disappear or become the focus during motion.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only uploaded START, KEY, and END frames, remove unrelated continuity locks, run crest readability QA, run dialogue-throughput/tail-hold QA for \"那是...Gaspard 的徽记\", run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if Ashe identity, bow state, crest non-text readability, Byleth witness continuity, and no-UI/no-subtitle presentation survive the probe.
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
      "EP03-SHOT016-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: [
      "prompt_rewrite_required",
      "unrelated_prompt_lock_cleanup_required",
      "crest_readability_qa_required",
      "dialogue_timing_qa_required",
      "helplessness_overhold_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot017 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      "Remove unrelated Rhea/Catherine/Lonato locks from Shot017 prompt.",
      "Run crest readability QA so the emblem is non-text and not Seiros/Blue Lions.",
      "Run dialogue-throughput and tail-hold QA for Ashe's recognition line.",
      "Run video-prompt QA against final candidate v1 actual frames.",
      "Run a 3-second motion probe before any approved_for_video promotion.",
    ],
    rubric: {
      story_beat: "pass",
      start_key_end_chain: "pass",
      character_identity_readability: "pass",
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
  console.log("recorded Shot017 final candidate v1: visual_review_passed / monitor_required");
}

main();
