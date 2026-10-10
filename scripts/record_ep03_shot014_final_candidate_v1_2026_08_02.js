const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot014";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT014-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot014-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot014_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot014_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot014/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot014/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot014/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot014_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot014_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot014_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot014/Shot014_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot014_local_asset_previs_proof_2026-07-31.jpg",
      "production_system/reviews/identity_lock_comparison_2026-07-31/Shot014_identity_comparison_2026-07-31.jpg",
      "assets/locations/EP03/act01/LonatoBattlefieldRidge/LonatoBattlefieldRidge_reference.png",
      "storyboards/Shot014/start_frame.png",
      "storyboards/Shot014/key_frame.png",
      "storyboards/Shot014/end_frame.png",
    ],
    note: "Generated final candidate v1 from Shot013 first-arrow handoff, local Shot014 evidence/proof, Dedue/Dimitri identity comparison, and Lonato battlefield ridge reference. Still-frame chain passes as pre-impact brace, arrow-to-shield impact, and advancing-rebel eyeline handoff. Downstream video remains monitor_required due to action timing, gore/wound drift, shield/arrow physics, and distant rebel crowd risks.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot013 final end continuity + local Shot014 evidence/proof + Dedue/Dimitri identity comparison + battlefield ridge reference + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot014 final candidate v1 visibly proves the first-arrow beat: start braces Dedue before contact, key shows one arrow embedded in the shield only, and end holds Dedue unhurt while Dimitri sees disciplined rebel silhouettes advancing through fog.";
  shot.required_revision = "Before approved_for_video, rewrite the executable web prompt so it references only uploaded START/KEY/END frames, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if the arrow enters a body, blood/gore appears, Dedue's identity or uniform drifts, Dimitri exits the protection line, or distant rebels become monsters/bandits.";
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

  fs.writeFileSync(reviewMdPath, `# Shot014 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot013/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot014/Shot014_local_video_source_evidence_2026-08-01.jpg\`
- Local proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot014_local_asset_previs_proof_2026-07-31.jpg\`

## Visual Audit

Shot purpose: push the fight from hidden tension into irreversible contact.

- Start frame: passes as pre-impact brace. Dedue is front line with shield up; Dimitri remains behind the protection line.
- Key frame: passes as action peak. One arrow is embedded in the round shield only, with shield debris and no wound or blood.
- End frame: passes as edit handoff. Dedue remains unhurt and steady while Dimitri's eyeline points toward disciplined silhouettes advancing through fog.
- Character identity: Dedue and Dimitri faces/wardrobe are readable enough for still-frame candidate approval.
- Frame chain: start/key/end are visually distinct and communicate brace, impact, and advancing-rebel handoff states.

## Blocking Issues

No still-frame story/action blocker for Shot014 final candidate v1.

## Downstream Risks

- Motion may turn shield impact into a wound, blood spray, or gore.
- Arrow/shaft physics may drift or duplicate.
- Distant rebels may become monsters, bandits, or a chaotic crowd.
- Dedue's academy uniform may drift into generic armor under action pressure.

## Required Revision Before Video Approval

Rewrite the executable web prompt so it references only the uploaded START, KEY, and END frames, run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if arrow-to-shield contact, Dedue/Dimitri identities, non-graphic tone, no-UI/no-subtitle presentation, and rebel handoff survive the probe.
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
      "EP03-SHOT013-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: [
      "prompt_rewrite_required",
      "arrow_shield_physics_monitor_required",
      "gore_wound_drift_monitor_required",
      "dedue_identity_monitor_required",
      "rebel_crowd_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot014 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      "Run video-prompt QA against final candidate v1 actual frames.",
      "Run a 3-second motion probe before any approved_for_video promotion.",
    ],
    rubric: {
      story_beat: "pass",
      start_key_end_chain: "pass",
      local_identity_readability: "pass",
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
  console.log("recorded Shot014 final candidate v1: visual_review_passed / monitor_required");
}

main();
