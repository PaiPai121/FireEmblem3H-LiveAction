const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot019";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT019-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot019-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot019_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot019_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot019/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot019/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot019/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot019_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot019_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot019_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot018/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot019/Shot019_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot019_local_asset_previs_proof_2026-07-31.jpg",
      "production_system/reviews/identity_lock_comparison_2026-07-31/Shot019_identity_comparison_2026-07-31.jpg",
      "assets/characters/blue_lions/Mercedes/academy/selected.png",
      "assets/characters/blue_lions/Annette/academy/selected.png",
      "assets/characters/blue_lions/Ingrid/academy/selected.png",
      "assets/locations/EP03/act01/MagdredWayFogRoad/MagdredWayFogRoad_reference.png",
      "storyboards/Shot019/start_frame.png",
      "storyboards/Shot019/key_frame.png",
      "storyboards/Shot019/end_frame.png",
    ],
    note: "Generated final candidate v1 from local Mercedes/Annette/Ingrid identity plates, Shot019 local video evidence, local asset proof, and Magdred fog road. Still-frame chain passes as evacuation setup, controlled fog-clearing support action, and guarded safe-lane handoff. Downstream video remains monitor_required due to identity mixing, magic spectacle, evacuee/wound focus, and dialogue timing risks.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot018 final end continuity + local Shot019 video evidence/proof + Mercedes/Annette/Ingrid identity references + Magdred fog road reference + constrained imagegen final candidate";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot019 final candidate v1 visibly proves the support-line beat: start shows Mercedes guiding an exhausted ally while Annette prepares, key shows Annette briefly opening the fog lane while Mercedes manages evacuation and Ingrid guards, and end lands on a readable safe path with distinct support roles.";
  shot.required_revision = "Before approved_for_video, rewrite the executable web prompt to remove unrelated Rhea/Catherine/Lonato locks and reference only uploaded START/KEY/END frames, run dialogue timing/tail-hold QA for Mercedes/Annette lines, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if characters swap costumes, magic becomes a spectacle, the evacuee becomes a gore/wound focus, Ingrid/Mercedes duplicate, or UI/subtitles appear.";
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

  fs.writeFileSync(reviewMdPath, `# Shot019 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot018/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot019/Shot019_local_video_source_evidence_2026-08-01.jpg\`
- Local proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot019_local_asset_previs_proof_2026-07-31.jpg\`

## Visual Audit

Shot purpose: show the rear line actively managing retreat and visibility control.

- Start frame: passes as support-line setup. Mercedes directs an exhausted ally, Annette prepares a controlled wind action, and Ingrid guards the perimeter.
- Key frame: passes as the action peak. Annette opens a narrow fog lane while Mercedes guides evacuation and Ingrid maintains watch.
- End frame: passes as the cut-out state. The safe path remains readable and all three support roles stay distinct.
- Character identity: Mercedes, Annette, and Ingrid are traceable to local academy identity plates, though multi-character motion needs monitoring for face and costume swaps.
- Frame chain: start/key/end are visually distinct and communicate setup, fog-clearing action, and safe-lane handoff states.

## Blocking Issues

No still-frame story/action blocker for Shot019 final candidate v1.

## Downstream Risks

- Current executable prompt contains unrelated Rhea/Catherine/Lonato locks and must be rewritten before video submission.
- Multi-character animation may swap faces, hair, or costumes between Mercedes, Annette, and Ingrid.
- Annette's fog control may become an oversized magic spectacle.
- The exhausted ally may become a gore/wound focus if unconstrained.
- 12 seconds needs dialogue timing so Mercedes and Annette lines land without subtitles or tail padding.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only uploaded START, KEY, and END frames, remove unrelated continuity locks, run dialogue-throughput/tail-hold QA for \"这边 / 我看见路了\", run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if identity separation, restrained fog movement, evacuation staging, and no-UI/no-subtitle presentation survive the probe.
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
      "EP03-SHOT018-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: [
      "prompt_rewrite_required",
      "unrelated_prompt_lock_cleanup_required",
      "dialogue_timing_qa_required",
      "multi_character_identity_swap_monitor_required",
      "magic_spectacle_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot019 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      "Remove unrelated Rhea/Catherine/Lonato locks from Shot019 prompt.",
      "Run dialogue-throughput and tail-hold QA for Mercedes and Annette lines.",
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
  console.log("recorded Shot019 final candidate v1: visual_review_passed / monitor_required");
}

main();
