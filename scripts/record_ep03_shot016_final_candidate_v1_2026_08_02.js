const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot016";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT016-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot016-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot016_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot016_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot016/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot016_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot016_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot016_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot016/Shot016_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot016_local_asset_previs_proof_2026-07-31.jpg",
      "production_system/reviews/identity_lock_comparison_2026-07-31/Shot016_identity_comparison_2026-07-31.jpg",
      "assets/characters/blue_lions/Dimitri/academy/selected.png",
      "assets/characters/protagonist/Byleth/professor/selected.png",
      "assets/characters/blue_lions/Dedue/academy/selected.png",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot016/start_frame.png",
      "storyboards/Shot016/key_frame.png",
      "storyboards/Shot016/end_frame.png",
    ],
    note: "Generated final candidate v1 from local Dimitri/Byleth/Dedue identity plates, Shot016 local video evidence, local asset proof, battlefield ridge, and Shot015 end continuity. Still-frame chain passes as pre-action line hold, controlled lance pushback, and Byleth-commanded stop. Downstream video remains monitor_required due to prompt contamination, bloodlust overstatement, weapon/gore drift, and dialogue timing risks.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot015 final end continuity + local Shot016 video evidence/proof + Dimitri/Byleth/Dedue identity references + battlefield ridge reference + constrained imagegen final candidate";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot016 final candidate v1 visibly proves Dimitri's restrained-force beat: start establishes the line and Byleth's impending command, key shows a non-graphic lance pushback with Dimitri close to overextending, and end lands on Dimitri stopped by Byleth while Dedue holds the line for the cut to Ashe's sigil recognition.";
  shot.required_revision = "Before approved_for_video, rewrite the executable web prompt to remove unrelated Rhea/Catherine/Lonato continuity locks and reference only uploaded START/KEY/END frames, run dialogue timing QA for Byleth/Dimitri, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if Dimitri kills, over-pursues, becomes war-phase/older, Byleth is missing, Dedue dominates, or gore/UI/subtitles appear.";
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

  fs.writeFileSync(reviewMdPath, `# Shot016 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot015/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot016/Shot016_local_video_source_evidence_2026-08-01.jpg\`
- Local proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot016_local_asset_previs_proof_2026-07-31.jpg\`

## Visual Audit

Shot purpose: show Dimitri's dangerous force while proving he still obeys Byleth.

- Start frame: passes as the line-hold pre-action state after Shot015 rebel pressure. Dimitri, Byleth, and Dedue are all visually readable from local identity references.
- Key frame: passes as the action peak. Dimitri drives a shielded rebel back with force, but the impact remains non-graphic and Byleth's raised hand is readable as the command to stop.
- End frame: passes as the cut-out state. Dimitri stops at the line with his lance lowered, Byleth's stop command remains visible, Dedue holds position, and the frame can cut to Ashe noticing a sigil.
- Character identity: Dimitri, Byleth, and Dedue preserve academy-era silhouettes and wardrobe topology closely enough for still-frame promotion.
- Frame chain: start/key/end are visually distinct and communicate pre-action, controlled pushback, and restrained stop states.

## Blocking Issues

No still-frame story/action blocker for Shot016 final candidate v1.

## Downstream Risks

- Current executable prompt contains unrelated Rhea/Catherine/Lonato locks and must be rewritten before video submission.
- Dimitri may drift into explicit bloodlust, lethal impalement, or triumphal violence.
- Weapon motion may generate gore, piercing, or a changed spear/lance.
- Byleth's command gesture may disappear during animation.
- 15 seconds may be too long for the short two-line exchange unless timing and tail hold are revised.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only uploaded START, KEY, and END frames, remove unrelated continuity locks, run dialogue-throughput/tail-hold QA for \"守线 / 明白\", run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if identity, wardrobe, non-graphic action, Byleth command visibility, and no-UI/no-subtitle presentation survive the probe.
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
      "EP03-SHOT015-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: [
      "prompt_rewrite_required",
      "unrelated_prompt_lock_cleanup_required",
      "dialogue_timing_qa_required",
      "bloodlust_monitor_required",
      "weapon_gore_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot016 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      "Remove unrelated Rhea/Catherine/Lonato locks from Shot016 prompt.",
      "Run dialogue-throughput and tail-hold QA for the Byleth/Dimitri exchange.",
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
  console.log("recorded Shot016 final candidate v1: visual_review_passed / monitor_required");
}

main();
