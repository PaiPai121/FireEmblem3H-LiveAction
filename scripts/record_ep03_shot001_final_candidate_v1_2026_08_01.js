const fs = require("fs");

const epRoot = "episodes/EP03";
const shotId = "Shot001";
const createdAt = "2026-08-01";
const artifactId = "EP03-SHOT001-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-01";
const reviewId = "review-2026-08-01-shot001-local-asset-final-candidate-v1";
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/shot001_local_asset_final_candidate_v1_review_2026-08-01.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/shot001_local_asset_final_candidate_v1_review_2026-08-01.jpg`;

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
    start: "storyboards/Shot001/local_asset_final_candidate_v1_2026-08-01/start_frame_local_asset_final_candidate_v1_2026-08-01.png",
    key: "storyboards/Shot001/local_asset_final_candidate_v1_2026-08-01/key_frame_local_asset_final_candidate_v1_2026-08-01.png",
    end: "storyboards/Shot001/local_asset_final_candidate_v1_2026-08-01/end_frame_local_asset_final_candidate_v1_2026-08-01.png",
  };
}

function candidateFrameSet() {
  return {
    frame_set_id: "Shot001_local_asset_final_candidate_v1_2026-08-01",
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: candidateFrames(),
    review_sheet: "production_system/reviews/shot001_local_asset_final_candidate_v1_review_2026-08-01.jpg",
    review_markdown: "production_system/reviews/shot001_local_asset_final_candidate_v1_review_2026-08-01.md",
    source_refs: [
      "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot001/Shot001_local_video_source_evidence_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
      "production_system/reviews/local_identity_plates_2026-08-01/divine_Sothis_dream_legacy_ep01_candidate_03_identity_plate_2026-08-01.jpg",
      "assets/locations/EP02/act03/RedCanyonZanado/RedCanyonZanado_reference.png",
      "storyboards/Shot001/start_frame.png",
      "storyboards/Shot001/key_frame.png",
      "storyboards/Shot001/end_frame.png",
    ],
    note: "Generated final candidate v1 from local source evidence, local identity plates, and v3 local selected.png previs. Still-frame story/action review passes; video generation remains monitor_required because image-to-video may drift face/wardrobe or over-brighten magic.",
  };
}

function applyShotStatus(shot) {
  const frameSet = candidateFrameSet();
  shot.local_asset_final_candidate_v1 = frameSet;
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = "local identity plates + local video evidence + constrained imagegen cleanup";
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = "Shot001 final candidate v1 visibly proves the dream-residue beat: start establishes Red Canyon dream space with Byleth/Sothis, key shows the green Sothis light crossing as the action peak, and end lands on Byleth/Sothis afterimage for the hard cut to morning bell. Byleth and Sothis remain readable against the local identity plates.";
  shot.required_revision = "Before approved_for_video, run video-prompt QA against these actual frames, add a short motion probe, and reject if Byleth/Sothis identity, costume topology, restrained performance, or no-UI/no-subtitle frame presentation drifts.";
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
  if (!queueShot || !deliveryShot) throw new Error("Shot001 not found in queue or delivery manifest");
  applyShotStatus(queueShot);
  applyShotStatus(deliveryShot);

  const reviewMd = `# Shot001 Local Asset Final Candidate V1 Review / 2026-08-01

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${reviewSheetPath.replace(`${epRoot}/`, "")}\`
- Start: \`${frames.start}\`
- Key: \`${frames.key}\`
- End: \`${frames.end}\`
- Source evidence: \`production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot001/Shot001_local_video_source_evidence_2026-08-01.jpg\`
- Byleth identity plate: \`production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg\`
- Sothis identity plate: \`production_system/reviews/local_identity_plates_2026-08-01/divine_Sothis_dream_legacy_ep01_candidate_03_identity_plate_2026-08-01.jpg\`

## Visual Audit

Shot purpose: preserve the previous chapter's mysterious consciousness and imply Byleth's origin belongs to more than the Church.

- Start frame: passes as pre-action dream state. Red Canyon geography is readable; Byleth and Sothis are present and integrated better than the V3 layout composite.
- Key frame: passes as action peak. Green Sothis light visibly crosses between the characters, and Byleth's restrained reaction is readable.
- End frame: passes as edit handoff. Byleth holds the afterimage while Sothis dissolves, supporting the hard cut to morning bell.
- Character identity: passes for still-frame readability against local identity plates, with residual downstream drift risk because these are generated cleanup frames.
- Frame chain: start/key/end are visually distinct; no duplicate-anchor issue.

## Blocking Issues

No still-frame story/action blocker for Shot001 final candidate v1.

## Downstream Risks

- Image-to-video may alter Byleth or Sothis faces, especially Sothis while dissolving.
- Green magic may over-brighten or become generic fantasy VFX.
- The model may add subtitles, UI, or a white flash unless the negative prompt is tightened against these exact frames.

## Required Revision Before Video Approval

Run video-prompt QA against these actual frames, add a 3-second motion probe, and only promote to \`approved_for_video\` if identity, wardrobe topology, frame presentation, restrained acting, and start/key/end motion continuity survive the probe.
`;

  fs.writeFileSync(reviewMdPath, reviewMd);

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
    source_refs: candidateFrameSet().source_refs,
    depends_on: [
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
      "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
    ],
    risk_flags: [
      "image_to_video_identity_monitor_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: "Shot001 final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.",
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
  console.log("recorded Shot001 final candidate v1: visual_review_passed / monitor_required");
}

main();
