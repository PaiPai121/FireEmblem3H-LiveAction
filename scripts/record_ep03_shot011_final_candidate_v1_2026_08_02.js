const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot011";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT011-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot011-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot011_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot011_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot011/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot011/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot011/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot011_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot011_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot011_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot010/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot011/Shot011_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot011_local_asset_previs_proof_2026-07-31.jpg",
      "assets/locations/EP03/act01/FaerghusBorderVillage/FaerghusBorderVillage_reference.png",
      "storyboards/Shot011/start_frame.png",
      "storyboards/Shot011/key_frame.png",
      "storyboards/Shot011/end_frame.png",
    ],
    note: "Generated final candidate v1 from Shot010 fog-road end continuity, local Shot011 evidence/proof, Faerghus border village location reference, and v3 layout. Still-frame chain passes as a restrained civilian-withdrawal beat: village entry, barred door action, and smoke-line handoff. Downstream video remains monitor_required due to distant identity, door/hand motion, and prompt contamination risks.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot010 final end continuity + local Shot011 evidence/proof + Faerghus border village reference + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot011 final candidate v1 visibly proves the border-village civilian pressure beat: start carries the party from fog road into the empty lane, key shows the door being barred while the Blue Lions keep distance, and end lands on a closed door with a smoke-line handoff toward the rebel camp.";
  shot.required_revision = "Before approved_for_video, rewrite the executable web prompt so it references only uploaded START/KEY/END frames, remove unrelated Rhea/Catherine/Lonato continuity locks, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if villagers become a crowd spectacle, identities drift, the door motion becomes threatening, or UI/subtitles/readable text appears.";
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

  fs.writeFileSync(reviewMdPath, `# Shot011 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot010/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot011/Shot011_local_video_source_evidence_2026-08-01.jpg\`
- Local character/location proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot011_local_asset_previs_proof_2026-07-31.jpg\`

## Visual Audit

Shot purpose: prove the rebellion's pressure on civilians without turning the moment into spectacle.

- Start frame: passes as the cut from fog road into a cold, empty Faerghus border village. Byleth, Ashe, and Mercedes are readable by local-asset wardrobe and silhouette.
- Key frame: passes as the action peak. The door/bar action is visible, the villager remains partial and anonymous, and the Blue Lions stop rather than intrude.
- End frame: passes as edit handoff. The barred door anchors the foreground while a smoke line beyond the village roofs points toward the next rebel-camp cut.
- Character identity: faces are mostly rear/side-facing by design; approval relies on wardrobe topology, hair color, prop state, and continuity with local identity plates.
- Frame chain: start/key/end are visually distinct and communicate entry, civilian withdrawal, and smoke-line cut-out state.

## Blocking Issues

No still-frame story/action blocker for Shot011 final candidate v1.

## Downstream Risks

- The current source prompt contains unrelated Rhea/Catherine/Lonato continuity locks and must be rewritten before web video use.
- The door/hand action may become threatening or too large in motion.
- Civilians may multiply into a crowd spectacle.
- Distant or rear-facing student identities may drift into generic medieval travelers.
- Smoke may become graphic destruction or modern fire imagery.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, remove unrelated continuity locks, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if restrained acting, door action, smoke-line handoff, identity/wardrobe locks, no-UI/no-subtitle presentation, and non-graphic tone survive the probe.
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
      "EP03-SHOT010-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: [
      "prompt_rewrite_required",
      "door_motion_monitor_required",
      "civilian_spectacle_monitor_required",
      "distant_identity_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot011 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      "Remove unrelated Rhea/Catherine/Lonato continuity locks from Shot011 prompt.",
      "Run video-prompt QA against final candidate v1 actual frames.",
      "Run a 3-second motion probe before any approved_for_video promotion.",
    ],
    rubric: {
      story_beat: "pass",
      start_key_end_chain: "pass",
      local_identity_readability: "pass_for_rear_and_side_silhouettes",
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
  console.log("recorded Shot011 final candidate v1: visual_review_passed / monitor_required");
}

main();
