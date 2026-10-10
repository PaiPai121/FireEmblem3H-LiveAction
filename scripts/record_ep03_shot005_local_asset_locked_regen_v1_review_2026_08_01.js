const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const shotId = "Shot005";
const frameSetId = "Shot005_local_asset_locked_regen_v1_frameset_2026-08-01";
const artifactId = "EP03-Shot005-LOCAL-ASSET-LOCKED-REGEN-V1-FRAMESET-2026-08-01";
const reviewId = "review-2026-08-01-Shot005-local-asset-locked-regen-v1-frameset";

const paths = {
  identityReview: `${epRoot}/production_system/identity_lock_review_2026-07-31.json`,
  artifactManifest: `${epRoot}/production_system/artifact_manifest.json`,
  reviewManifest: `${epRoot}/production_system/review_manifest.json`,
  deliveryManifest: `${epRoot}/production_system/video_delivery_manifest.json`,
  queue: `${epRoot}/frame_generation_queue.json`,
};

const frameSet = {
  id: frameSetId,
  decision: "visual_review_passed",
  frames: {
    start: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/005_Shot005/local_asset_locked_regen_v1_2026-08-01/start_frame_local_asset_locked_regen_v1_2026-08-01.png",
    key: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/005_Shot005/local_asset_locked_regen_v1_2026-08-01/key_frame_local_asset_locked_regen_v1_2026-08-01.png",
    end: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/005_Shot005/local_asset_locked_regen_v1_2026-08-01/end_frame_local_asset_locked_regen_v1_2026-08-01.png",
  },
  storyboard_frames: {
    start: "storyboards/Shot005/local_asset_locked_regen_v1_2026-08-01/start_frame_local_asset_locked_regen_v1_2026-08-01.png",
    key: "storyboards/Shot005/local_asset_locked_regen_v1_2026-08-01/key_frame_local_asset_locked_regen_v1_2026-08-01.png",
    end: "storyboards/Shot005/local_asset_locked_regen_v1_2026-08-01/end_frame_local_asset_locked_regen_v1_2026-08-01.png",
  },
  review_sheet: "production_system/reviews/shot005_local_asset_locked_regen_v1_review_2026-08-01.jpg",
  review_markdown: "production_system/reviews/shot005_local_asset_locked_regen_v1_review_2026-08-01.md",
  local_video_source_exact: "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot005/local_video_exact.jpg",
  local_video_source_evidence: "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot005/Shot005_local_video_source_evidence_2026-08-01.jpg",
  source_timecode_audit: "production_system/source_timecode_audit_2026-08-01.json",
  local_identity_plates: [
    "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg",
    "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg",
    "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
  ],
  local_asset_refs: [
    "assets/locations/EP02/act01/OfficersAcademyClassroom/OfficersAcademyClassroom_reference.png",
  ],
  prompt_paths: [
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/005_Shot005/start_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/005_Shot005/key_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/005_Shot005/end_frame_prompt.md",
  ],
  negative_prompt_path: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/005_Shot005/negative_prompt.md",
  reason: "Shot005 source footage is field dialogue, so V1 is correctly treated as an adaptation-expansion classroom aftermath using local Ashe, Dimitri, Byleth, and classroom assets. It passes still-frame visual QA only; video-prompt QA, motion probe, and adjacent continuity are still required.",
  required_revision: "Run video-prompt QA against the V1 real frames, create a short motion probe, and re-check strict continuity with Shot004/Shot006 before any approved_for_video promotion.",
};

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

function updateIdentityReview() {
  const identityReview = readJson(paths.identityReview);
  identityReview.identity_regeneration_frame_sets = identityReview.identity_regeneration_frame_sets || {};
  identityReview.identity_regeneration_frame_sets[frameSet.id] = {
    frames: frameSet.frames,
    storyboard_frames: frameSet.storyboard_frames,
    review_sheet: frameSet.review_sheet,
    review_markdown: frameSet.review_markdown,
    local_video_source_exact: frameSet.local_video_source_exact,
    local_video_source_evidence: frameSet.local_video_source_evidence,
    source_timecode_audit: frameSet.source_timecode_audit,
    local_identity_plates: frameSet.local_identity_plates,
    local_asset_refs: frameSet.local_asset_refs,
    decision: frameSet.decision,
    reason: frameSet.reason,
  };
  identityReview.shots = identityReview.shots || {};
  identityReview.shots[shotId] = {
    decision: frameSet.decision,
    reason: frameSet.reason,
    latest_regeneration_frame_set: frameSet.id,
    previous_failed_frame_set: "Shot005_identity_locked_regen_v2_frameset_2026-08-01",
  };
  writeJson(paths.identityReview, identityReview);
}

function updateDeliveryManifest() {
  const delivery = readJson(paths.deliveryManifest);
  const shot = (delivery.shots || []).find((candidate) => candidate.id === shotId);
  if (!shot) throw new Error(`${shotId} not found in video delivery manifest`);
  shot.status = "visual_review_passed";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = frameSet.reason;
  shot.required_revision = frameSet.required_revision;
  shot.regenerated_frames = frameSet.frames;
  shot.local_asset_locked_regen_v1 = {
    frame_set_id: frameSet.id,
    storyboard_frames: frameSet.storyboard_frames,
    review_sheet: frameSet.review_sheet,
    review_markdown: frameSet.review_markdown,
    local_video_source_exact: frameSet.local_video_source_exact,
    local_video_source_evidence: frameSet.local_video_source_evidence,
    local_asset_refs: frameSet.local_asset_refs,
  };
  shot.video_prompt_qa_decision = "pending_against_local_asset_locked_v1_frames";
  shot.motion_probe_status = "pending_short_probe_after_prompt_qa";
  shot.approved_for_video_blockers = [
    "video-prompt QA has not been rerun against the V1 real frames",
    "short motion probe has not been generated or reviewed",
    "strict continuity with Shot004 and Shot006 has not passed",
  ];
  writeJson(paths.deliveryManifest, delivery);
}

function updateQueue() {
  const queue = readJson(paths.queue);
  const shot = (queue.shots || []).find((candidate) => candidate.id === shotId);
  if (!shot) throw new Error(`${shotId} not found in frame generation queue`);
  shot.status = "local_asset_locked_regen_v1_visual_review_passed";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = frameSet.reason;
  shot.required_revision = frameSet.required_revision;
  shot.local_asset_locked_regen_v1 = {
    frame_set_id: frameSet.id,
    frames: frameSet.storyboard_frames,
    review_sheet: frameSet.review_sheet,
    review_markdown: frameSet.review_markdown,
  };
  writeJson(paths.queue, queue);
}

function updateManifests() {
  const artifacts = readJson(paths.artifactManifest);
  const reviews = readJson(paths.reviewManifest);
  const reviewedPaths = [
    frameSet.frames.start,
    frameSet.frames.key,
    frameSet.frames.end,
    frameSet.storyboard_frames.start,
    frameSet.storyboard_frames.key,
    frameSet.storyboard_frames.end,
    frameSet.review_sheet,
    frameSet.review_markdown,
    frameSet.local_video_source_exact,
    frameSet.local_video_source_evidence,
    frameSet.source_timecode_audit,
    ...frameSet.local_identity_plates,
    ...frameSet.local_asset_refs,
  ];

  upsertBy(artifacts.artifacts, "id", {
    id: artifactId,
    type: "storyboard_frame_set",
    stage: "storyboard",
    status: "visual_review_passed",
    created_by: "imagegen-storyboard-agent",
    created_at: createdAt,
    paths: reviewedPaths,
    source_refs: [
      ...frameSet.prompt_paths,
      frameSet.negative_prompt_path,
      "storyboards/Shot005/frame_spec.md",
      "storyboards/Shot005/metadata.json",
      "source_refs/Shot005_source.png",
      "production_system/reviews/local_identity_plates_2026-08-01/index.json",
      "production_system/reviews/local_video_source_frames_2026-08-01/index.json",
      frameSet.source_timecode_audit,
      "production_system/identity_lock_review_2026-07-31.json",
    ],
    depends_on: [
      "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01",
      "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
      "EP03-SOURCE-TIMECODE-AUDIT-2026-08-01",
      "EP03-Shot005-FRAME-SPEC",
    ],
    continuity: {
      previous: "Shot004",
      next: "Shot006",
      in: "cut from Ashe absorbing Lonato's name",
      out: "cut to Ashe beginning to speak",
    },
    risk_flags: ["adaptation_expansion_from_field_dialogue", "not_approved_for_video", "motion_probe_pending", "adjacent_continuity_pending", "ashe_hair_color_monitor"],
    notes: frameSet.reason,
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: artifactId,
    review_id: reviewId,
    reviewer_role: "asset-identity-qa-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "visual_review_passed",
    blocking_issues: [],
    required_revisions: [
      "Run video-prompt QA against the V1 real start/key/end frames.",
      "Generate and review a short motion probe before full-duration video generation.",
      "Run strict adjacent-shot continuity with Shot004 and Shot006 before approved_for_video.",
    ],
    rubric: {
      local_source_traceability: "pass_dialogue_timing_only",
      adaptation_expansion_disclosure: "pass",
      local_identity_plate_traceability: "pass",
      ashe_identity: "pass_with_hair_color_monitor",
      dimitri_identity: "pass",
      byleth_identity: "pass_for_back_view",
      classroom_traceability: "pass",
      no_ui_or_subtitles: "pass",
      frame_chain: "pass_still_frames_only",
      video_readiness: "not_approved_for_video",
    },
    reviewed_paths: reviewedPaths,
  });

  writeJson(paths.artifactManifest, artifacts);
  writeJson(paths.reviewManifest, reviews);
}

function main() {
  updateIdentityReview();
  updateDeliveryManifest();
  updateQueue();
  updateManifests();
  console.log(`recorded ${frameSet.id}`);
}

main();
