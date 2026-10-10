const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const shotId = "Shot004";

const paths = {
  identityReview: `${epRoot}/production_system/identity_lock_review_2026-07-31.json`,
  artifactManifest: `${epRoot}/production_system/artifact_manifest.json`,
  reviewManifest: `${epRoot}/production_system/review_manifest.json`,
  deliveryManifest: `${epRoot}/production_system/video_delivery_manifest.json`,
  queue: `${epRoot}/frame_generation_queue.json`,
};

const frameSets = [
  {
    version: "v2",
    id: "Shot004_local_source_locked_regen_v2_frameset_2026-08-01",
    artifactId: "EP03-Shot004-LOCAL-SOURCE-LOCKED-REGEN-V2-FRAMESET-2026-08-01",
    reviewId: "review-2026-08-01-Shot004-local-source-locked-regen-v2-frameset",
    decision: "blocked_needs_revision",
    review_sheet: "production_system/reviews/shot004_local_source_locked_regen_v2_review_2026-08-01.jpg",
    review_markdown: "production_system/reviews/shot004_local_source_locked_regen_v2_review_2026-08-01.md",
    reason: "V2 improves cathedral composition and restrained performance but Ashe's age read and hair color drift too mature/silver-gray against the local academy identity plate.",
    required_revisions: [
      "Regenerate with stricter youthful academy-age Ashe face preservation.",
      "Restore sandy blond hair instead of silver-gray hair.",
      "Keep Byleth and Dimitri secondary and preserve cathedral axis.",
    ],
    risk_flags: ["rejected_identity_drift", "ashe_age_drift", "ashe_hair_color_drift"],
  },
  {
    version: "v3",
    id: "Shot004_local_source_locked_regen_v3_frameset_2026-08-01",
    artifactId: "EP03-Shot004-LOCAL-SOURCE-LOCKED-REGEN-V3-FRAMESET-2026-08-01",
    reviewId: "review-2026-08-01-Shot004-local-source-locked-regen-v3-frameset",
    decision: "visual_review_passed",
    review_sheet: "production_system/reviews/shot004_local_source_locked_regen_v3_review_2026-08-01.jpg",
    review_markdown: "production_system/reviews/shot004_local_source_locked_regen_v3_review_2026-08-01.md",
    reason: "V3 is traceable to the corrected local source frame at 00:03:40 and the local Ashe/Byleth/Dimitri identity plates. It passes still-frame visual QA only; video-prompt QA, motion probe, and adjacent continuity are still required.",
    required_revisions: [
      "Run video-prompt QA against the V3 real start/key/end frames.",
      "Generate and review a short motion probe before full-duration video generation.",
      "Run strict adjacent-shot continuity with Shot003 and Shot005 before approved_for_video.",
    ],
    risk_flags: ["not_approved_for_video", "motion_probe_pending", "adjacent_continuity_pending"],
  },
];

const shared = {
  local_video_source_exact: "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot004/local_video_exact.jpg",
  local_video_source_evidence: "production_system/reviews/local_video_source_frames_2026-08-01/per_shot/Shot004/Shot004_local_video_source_evidence_2026-08-01.jpg",
  source_timecode_audit: "production_system/source_timecode_audit_2026-08-01.json",
  local_identity_plates: [
    "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Ashe_academy_selected_identity_plate_2026-08-01.jpg",
    "production_system/reviews/local_identity_plates_2026-08-01/characters_protagonist_Byleth_professor_selected_identity_plate_2026-08-01.jpg",
    "production_system/reviews/local_identity_plates_2026-08-01/characters_blue_lions_Dimitri_academy_selected_identity_plate_2026-08-01.jpg",
  ],
  prompt_paths: [
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/start_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/key_frame_prompt.md",
    "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/end_frame_prompt.md",
  ],
  negative_prompt_path: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/negative_prompt.md",
};

function framePaths(version) {
  return {
    start: `delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/local_source_locked_regen_${version}_2026-08-01/start_frame_local_source_locked_regen_${version}_2026-08-01.png`,
    key: `delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/local_source_locked_regen_${version}_2026-08-01/key_frame_local_source_locked_regen_${version}_2026-08-01.png`,
    end: `delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/004_Shot004/local_source_locked_regen_${version}_2026-08-01/end_frame_local_source_locked_regen_${version}_2026-08-01.png`,
  };
}

function storyboardFramePaths(version) {
  return {
    start: `storyboards/Shot004/local_source_locked_regen_${version}_2026-08-01/start_frame_local_source_locked_regen_${version}_2026-08-01.png`,
    key: `storyboards/Shot004/local_source_locked_regen_${version}_2026-08-01/key_frame_local_source_locked_regen_${version}_2026-08-01.png`,
    end: `storyboards/Shot004/local_source_locked_regen_${version}_2026-08-01/end_frame_local_source_locked_regen_${version}_2026-08-01.png`,
  };
}

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
  for (const set of frameSets) {
    identityReview.identity_regeneration_frame_sets[set.id] = {
      frames: framePaths(set.version),
      storyboard_frames: storyboardFramePaths(set.version),
      review_sheet: set.review_sheet,
      review_markdown: set.review_markdown,
      local_video_source_exact: shared.local_video_source_exact,
      local_video_source_evidence: shared.local_video_source_evidence,
      source_timecode_audit: shared.source_timecode_audit,
      local_identity_plates: shared.local_identity_plates,
      decision: set.decision,
      reason: set.reason,
    };
  }
  identityReview.shots = identityReview.shots || {};
  identityReview.shots[shotId] = {
    decision: "visual_review_passed",
    reason: frameSets[1].reason,
    latest_regeneration_frame_set: frameSets[1].id,
    previous_failed_frame_sets: [
      "Shot004_identity_locked_regen_frameset_2026-08-01",
      frameSets[0].id,
    ],
  };
  writeJson(paths.identityReview, identityReview);
}

function updateDeliveryManifest() {
  const delivery = readJson(paths.deliveryManifest);
  const shot = (delivery.shots || []).find((candidate) => candidate.id === shotId);
  if (!shot) throw new Error(`${shotId} not found in video delivery manifest`);
  shot.status = "visual_review_passed";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = frameSets[1].reason;
  shot.required_revision = frameSets[1].required_revisions.join(" ");
  shot.regenerated_frames = framePaths("v3");
  shot.local_source_locked_regen_v3 = {
    frame_set_id: frameSets[1].id,
    storyboard_frames: storyboardFramePaths("v3"),
    review_sheet: frameSets[1].review_sheet,
    review_markdown: frameSets[1].review_markdown,
    local_video_source_exact: shared.local_video_source_exact,
    local_video_source_evidence: shared.local_video_source_evidence,
  };
  shot.rejected_regeneration_frame_sets = [
    {
      frame_set_id: frameSets[0].id,
      decision: frameSets[0].decision,
      review_sheet: frameSets[0].review_sheet,
      review_markdown: frameSets[0].review_markdown,
      reason: frameSets[0].reason,
    },
  ];
  shot.video_prompt_qa_decision = "pending_against_local_source_locked_v3_frames";
  shot.motion_probe_status = "pending_short_probe_after_prompt_qa";
  shot.approved_for_video_blockers = frameSets[1].required_revisions;
  writeJson(paths.deliveryManifest, delivery);
}

function updateQueue() {
  const queue = readJson(paths.queue);
  const shot = (queue.shots || []).find((candidate) => candidate.id === shotId);
  if (!shot) throw new Error(`${shotId} not found in frame generation queue`);
  shot.status = "local_source_locked_regen_v3_visual_review_passed";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = frameSets[1].reason;
  shot.required_revision = frameSets[1].required_revisions.join(" ");
  shot.local_source_locked_regen_v3 = {
    frame_set_id: frameSets[1].id,
    frames: storyboardFramePaths("v3"),
    review_sheet: frameSets[1].review_sheet,
    review_markdown: frameSets[1].review_markdown,
  };
  shot.rejected_regeneration_frame_sets = [
    {
      frame_set_id: frameSets[0].id,
      decision: frameSets[0].decision,
      reason: frameSets[0].reason,
    },
  ];
  writeJson(paths.queue, queue);
}

function updateManifests() {
  const artifacts = readJson(paths.artifactManifest);
  const reviews = readJson(paths.reviewManifest);

  for (const set of frameSets) {
    const frames = framePaths(set.version);
    const storyboardFrames = storyboardFramePaths(set.version);
    const reviewedPaths = [
      frames.start,
      frames.key,
      frames.end,
      storyboardFrames.start,
      storyboardFrames.key,
      storyboardFrames.end,
      set.review_sheet,
      set.review_markdown,
      shared.local_video_source_exact,
      shared.local_video_source_evidence,
      shared.source_timecode_audit,
      ...shared.local_identity_plates,
    ];

    upsertBy(artifacts.artifacts, "id", {
      id: set.artifactId,
      type: "storyboard_frame_set",
      stage: "storyboard",
      status: set.decision,
      created_by: "imagegen-storyboard-agent",
      created_at: createdAt,
      paths: reviewedPaths,
      source_refs: [
        ...shared.prompt_paths,
        shared.negative_prompt_path,
        "storyboards/Shot004/frame_spec.md",
        "storyboards/Shot004/metadata.json",
        "source_refs/Shot004_source.png",
        "production_system/reviews/local_identity_plates_2026-08-01/index.json",
        "production_system/reviews/local_video_source_frames_2026-08-01/index.json",
        shared.source_timecode_audit,
        "production_system/identity_lock_review_2026-07-31.json",
      ],
      depends_on: [
        "EP03-IDENTITY-LOCKED-KEYFRAME-REGENERATION-HANDOFF-2026-08-01",
        "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
        "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
        "EP03-SOURCE-TIMECODE-AUDIT-2026-08-01",
        "EP03-Shot004-FRAME-SPEC",
      ],
      continuity: {
        previous: "Shot003",
        next: "Shot005",
        in: "cut from Rhea mission order",
        out: "cut on Ashe absorbing Lonato's name",
      },
      risk_flags: set.risk_flags,
      notes: set.reason,
    });

    upsertBy(reviews.reviews, "review_id", {
      artifact_id: set.artifactId,
      review_id: set.reviewId,
      reviewer_role: "asset-identity-qa-agent",
      reviewer: "codex",
      created_at: createdAt,
      decision: set.decision,
      blocking_issues: set.decision === "visual_review_passed" ? [] : set.required_revisions,
      required_revisions: set.required_revisions,
      rubric: {
        local_video_source_traceability: "pass",
        local_identity_plate_traceability: "pass",
        ashe_identity: set.decision === "visual_review_passed" ? "pass" : "fail",
        byleth_background_read: "pass_for_secondary_role",
        dimitri_background_read: "pass_for_secondary_role",
        no_ui_or_subtitles: "pass",
        frame_chain: set.decision === "visual_review_passed" ? "pass_still_frames_only" : "blocked",
        video_readiness: "not_approved_for_video",
      },
      reviewed_paths: reviewedPaths,
    });
  }

  writeJson(paths.artifactManifest, artifacts);
  writeJson(paths.reviewManifest, reviews);
}

function main() {
  updateIdentityReview();
  updateDeliveryManifest();
  updateQueue();
  updateManifests();
  console.log("recorded Shot004 local-source-locked regen v2/v3 reviews");
}

main();
