const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot009";
const createdAt = "2026-08-02";
const artifactId = "EP03-SHOT009-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02";
const reviewId = "review-2026-08-02-shot009-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot009_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot009_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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
    start: "storyboards/Shot009/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png",
    key: "storyboards/Shot009/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png",
    end: "storyboards/Shot009/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
  };
}

function frameSet() {
  return {
    frame_set_id: "Shot009_local_asset_final_candidate_v1_2026-08-02",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: "production_system/reviews/shot009_local_asset_final_candidate_v1_review_2026-08-02.jpg",
    review_markdown: "production_system/reviews/shot009_local_asset_final_candidate_v1_review_2026-08-02.md",
    source_refs: [
      "storyboards/Shot007/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png",
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot009/Shot009_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_asset_previs_proof_2026-07-31/Shot009_local_asset_previs_proof_2026-07-31.jpg",
      "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
      "storyboards/Shot009/start_frame.png",
      "storyboards/Shot009/key_frame.png",
      "storyboards/Shot009/end_frame.png",
    ],
    note: "Generated final candidate v1 from Shot007 end continuity, local Shot009 source evidence, local character/flag proof, Church flag reference, and v3 layout. Still-frame chain passes as departure from monastery order into border fog; downstream video remains monitor_required due to distant group identity and fog/silhouette continuity risk.",
  };
}

function applyShotStatus(shot) {
  shot.local_asset_final_candidate_v1 = frameSet();
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "Shot007 final end continuity + local Shot009 evidence/proof + Church flag reference + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot009 final candidate v1 visibly proves the transition from monastery order into border fog: start carries forward the prepared line near the gate, key moves the group down the wet road with flags receding, and end lets fog swallow the monastery for the dissolve.";
  shot.required_revision = "Before approved_for_video, run video-prompt QA against these actual frames, add a 3-second motion probe, and reject if the tone becomes cheerful, the group reverses direction, flags/monastery geography jumps, or distant silhouettes drift into war armor or generic soldiers.";
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

  fs.writeFileSync(reviewMdPath, `# Shot009 Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Continuity input: \`storyboards/Shot007/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot009/Shot009_local_video_source_evidence_2026-08-01.jpg\`
- Local character/flag proof: \`production_system/reviews/local_asset_previs_proof_2026-07-31/Shot009_local_asset_previs_proof_2026-07-31.jpg\`

## Visual Audit

Shot purpose: move from monastery order into the border fog zone.

- Start frame: passes as continuity from the prepared departure line; monastery wall, flags, wet stone, and small character silhouettes establish the cut-in.
- Key frame: passes as action peak. The group has passed the gate, flags recede, the road pulls toward the forest, and low clouds dominate.
- End frame: passes as dissolve handoff. The monastery is distant and almost swallowed by fog, preparing the next fog-road shot.
- Character identity: figures are intentionally small, so still-frame approval relies on silhouette/costume continuity rather than face proof.
- Frame chain: start/key/end are visually distinct and communicate beginning, peak, and cut-out state.

## Blocking Issues

No still-frame story/action blocker for Shot009 final candidate v1.

## Downstream Risks

- Distant figures may drift into generic soldiers or war armor.
- Direction of travel may reverse during motion.
- Fog can swallow flags/monastery too early and break geography.
- Tone can become heroic parade or cheerful academy departure.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if direction, monastery/flag geography, subdued tone, small-character silhouettes, and no-UI/no-subtitle presentation survive the probe.
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
      "EP03-SHOT007-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02",
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: ["distant_group_identity_monitor_required", "fog_geography_monitor_required", "not_approved_for_video", "motion_probe_required"],
    notes: "Shot009 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
      local_identity_readability: "pass_for_distant_silhouettes",
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
  console.log("recorded Shot009 final candidate v1: visual_review_passed / monitor_required");
}

main();
