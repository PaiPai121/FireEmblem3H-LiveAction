const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const shotId = "Shot002";
const frameSetId = "Shot002_local_asset_locked_regen_v1_frameset_2026-08-01";
const artifactId = "EP03-Shot002-LOCAL-ASSET-LOCKED-REGEN-V1-FRAMESET-2026-08-01";
const reviewId = "review-2026-08-01-Shot002-local-asset-locked-regen-v1-frameset";

const paths = {
  identityReview: `${epRoot}/production_system/identity_lock_review_2026-07-31.json`,
  artifactManifest: `${epRoot}/production_system/artifact_manifest.json`,
  reviewManifest: `${epRoot}/production_system/review_manifest.json`,
  deliveryManifest: `${epRoot}/production_system/video_delivery_manifest.json`,
  queue: `${epRoot}/frame_generation_queue.json`,
};

const frameSet = {
  id: frameSetId,
  shot: shotId,
  decision: "visual_review_passed",
  frames: {
    start: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/local_asset_locked_regen_v1_2026-08-01/start_frame_local_asset_locked_regen_v1_2026-08-01.png",
    key: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/local_asset_locked_regen_v1_2026-08-01/key_frame_local_asset_locked_regen_v1_2026-08-01.png",
    end: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/local_asset_locked_regen_v1_2026-08-01/end_frame_local_asset_locked_regen_v1_2026-08-01.png",
  },
  storyboard_frames: {
    start: "storyboards/Shot002/local_asset_locked_regen_v1_2026-08-01/start_frame_local_asset_locked_regen_v1_2026-08-01.png",
    key: "storyboards/Shot002/local_asset_locked_regen_v1_2026-08-01/key_frame_local_asset_locked_regen_v1_2026-08-01.png",
    end: "storyboards/Shot002/local_asset_locked_regen_v1_2026-08-01/end_frame_local_asset_locked_regen_v1_2026-08-01.png",
  },
  review_sheet: "production_system/reviews/shot002_local_asset_locked_regen_v1_review_2026-08-01.jpg",
  review_markdown: "production_system/reviews/shot002_local_asset_locked_regen_v1_review_2026-08-01.md",
  local_video_source_exact: "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot002/local_video_exact.jpg",
  local_video_source_evidence: "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot002/Shot002_local_video_source_evidence_2026-08-01.jpg",
  source_timecode_audit: "production_system/source_timecode_audit_2026-08-01.json",
  local_identity_plates: [
    "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
  ],
  local_asset_refs: [
    "assets/locations/EP02/act01/MonasteryMainCloister/MonasteryMainCloister_reference.png",
    "assets/props/shared/church_of_seiros_crest_flags/church_of_seiros_crest_flags_reference.png",
  ],
  prompt_paths: [
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/start_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/key_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/end_frame_prompt.md",
  ],
  negative_prompt_path: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/negative_prompt.md",
  reason: "Shot002 source footage is a chapter title card, so V1 is correctly treated as an adaptation-expansion frame set using local Byleth, monastery cloister, and Church crest assets. It passes still-frame visual QA only; video-prompt QA, motion probe, and adjacent continuity are still required.",
  required_revision: "Run video-prompt QA against the V1 real frames, create a short motion probe, and re-check strict continuity with Shot001/Shot003 before any approved_for_video promotion.",
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
    previous_failed_frame_set: "Shot002_identity_locked_regen_v2_frameset_2026-08-01",
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
    "strict continuity with Shot001 and Shot003 has not passed",
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
      "storyboards/Shot002/frame_spec.md",
      "storyboards/Shot002/metadata.json",
      "source_refs/Shot002_source.png",
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
      "EP03-Shot002-FRAME-SPEC",
    ],
    continuity: {
      previous: "Shot001",
      next: "Shot003",
      in: "chapter title card dissolves into morning cloister",
      out: "cut toward cathedral mission briefing",
    },
    risk_flags: ["adaptation_expansion_from_title_card", "not_approved_for_video", "motion_probe_pending", "adjacent_continuity_pending"],
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
      "Run strict adjacent-shot continuity with Shot001 and Shot003 before approved_for_video.",
    ],
    rubric: {
      local_source_traceability: "pass_title_card_only",
      adaptation_expansion_disclosure: "pass",
      local_identity_plate_traceability: "pass",
      byleth_identity: "pass",
      monastery_cloister_traceability: "pass",
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
