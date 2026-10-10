const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-01";
const identityReviewPath = `${epRoot}/production_system/identity_lock_review_2026-07-31.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const deliveryManifestPath = `${epRoot}/production_system/video_delivery_manifest.json`;

const demotions = {
  Shot002: {
    frameSetId: "Shot002_identity_locked_regen_v2_frameset_2026-08-01",
    reviewMarkdown: "production_system/reviews/shot002_local_asset_truth_audit_2026-08-01.md",
    reviewSheet: "production_system/reviews/shot002_identity_locked_regen_v2_review_2026-08-01.jpg",
    frames: {
      start: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/start_frame_identity_locked_regen_v2_2026-08-01.png",
      key: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/key_frame_identity_locked_regen_v2_2026-08-01.png",
      end: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/002_Shot002/end_frame_identity_locked_regen_v2_2026-08-01.png",
    },
    finding: "Local asset truth audit: the v2 frames are AI rerenders seeded by local plates, not local asset frames; Byleth identity is hidden/softened rather than proven against the local selected.png and original video source.",
    requiredRevision: "Rebuild Shot002 from original local video frames plus selected/reference identity plates as visible source evidence; keep the current v2 frames as composition candidates only.",
  },
  Shot003: {
    frameSetId: "Shot003_identity_locked_regen_v2_frameset_2026-08-01",
    reviewMarkdown: "production_system/reviews/shot003_identity_locked_regen_v2_review_2026-08-01.md",
    reviewSheet: "production_system/reviews/shot003_identity_locked_regen_v2_review_2026-08-01.jpg",
    frames: {
      start: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/003_Shot003/start_frame_identity_locked_regen_v2_2026-08-01.png",
      key: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/003_Shot003/key_frame_identity_locked_regen_v2_2026-08-01.png",
      end: "delivery/identity_locked_keyframe_regeneration_2026-08-01/shots/003_Shot003/end_frame_identity_locked_regen_v2_2026-08-01.png",
    },
    finding: "Local asset truth audit: the v2 frames preserve broad council blocking but do not prove strict Rhea/Seteth/Byleth/Dimitri identity against local selected/reference assets and local source video frames.",
    requiredRevision: "Rebuild Shot003 from the local video source frames plus selected/reference identity plates; produce a side-by-side local source / identity plate / generated frame audit before any visual pass.",
  },
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

function main() {
  const identityReview = readJson(identityReviewPath);
  identityReview.identity_regeneration_frame_sets = identityReview.identity_regeneration_frame_sets || {};
  identityReview.shots = identityReview.shots || {};

  for (const [shotId, audit] of Object.entries(demotions)) {
    identityReview.identity_regeneration_frame_sets[audit.frameSetId] = {
      frames: audit.frames,
      review_sheet: audit.reviewSheet,
      review_markdown: audit.reviewMarkdown,
      decision: "blocked_needs_revision",
      reason: audit.finding,
    };
    identityReview.shots[shotId] = {
      decision: "blocked_needs_revision",
      reason: audit.finding,
      latest_regeneration_frame_set: audit.frameSetId,
    };
  }
  writeJson(identityReviewPath, identityReview);

  const delivery = readJson(deliveryManifestPath);
  for (const shot of delivery.shots || []) {
    const audit = demotions[shot.id];
    if (!audit) continue;
    shot.status = "blocked_needs_revision";
    shot.visual_audit_decision = "blocked_needs_revision";
    shot.visual_audit_finding = audit.finding;
    shot.required_revision = audit.requiredRevision;
    shot.regenerated_frames = audit.frames;
    shot.video_prompt_qa_decision = "blocked_needs_revision";
    shot.motion_probe_status = "blocked_until_local_asset_identity_pass";
  }
  writeJson(deliveryManifestPath, delivery);

  const artifacts = readJson(artifactManifestPath);
  const reviews = readJson(reviewManifestPath);
  const localSourcePaths = [
    "production_system/reviews/local_video_source_frames_2026-08-01/index.md",
    "production_system/reviews/local_video_source_frames_2026-08-01/cutted_ep3_shot3_contact_sheet.jpg",
    "production_system/reviews/local_video_source_frames_2026-08-01/P4_blue_lions_00_contact_sheet.jpg",
  ];

  upsertBy(artifacts.artifacts, "id", {
    id: "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    type: "source_evidence",
    stage: "source_audit",
    status: "layout_reference",
    created_by: "source-provenance-agent",
    created_at: createdAt,
    paths: localSourcePaths,
    source_refs: [
      "/Users/zekun/FireEmblemMovie/originAssets/cutted/ep3 shot3.mov",
      "/Users/zekun/FireEmblemMovie/originAssets/火焰纹章风花雪月【剧情合集·精简版】 (P4. 白云之章EP3雾中的叛乱（青狮）)[00].mp4",
    ],
    depends_on: [],
    risk_flags: ["contains_game_ui", "source_evidence_only", "not_final_cinematic_frames"],
    notes: "Local video source contact sheets used as provenance evidence for EP03 identity and scene audit.",
  });

  upsertBy(reviews.reviews, "review_id", {
    artifact_id: "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    review_id: "review-2026-08-01-local-video-source-frames",
    reviewer_role: "source-provenance-agent",
    reviewer: "codex",
    created_at: createdAt,
    decision: "layout_reference",
    blocking_issues: [
      "Source frames contain game UI/subtitles/watermarks and cannot be used as final cinematic frames.",
    ],
    required_revisions: [
      "Use these frames as first-layer provenance evidence when regenerating EP03 keyframes.",
    ],
    rubric: {
      local_video_traceability: "pass",
      final_frame_readiness: "not_applicable",
      video_readiness: "blocked_needs_revision",
    },
    reviewed_paths: localSourcePaths,
  });

  for (const [shotId, audit] of Object.entries(demotions)) {
    const artifactId = `EP03-${shotId}-LOCAL-ASSET-TRUTH-AUDIT-2026-08-01`;
    upsertBy(artifacts.artifacts, "id", {
      id: artifactId,
      type: "storyboard_frame_set",
      stage: "storyboard",
      status: "blocked_needs_revision",
      created_by: "imagegen-storyboard-agent",
      created_at: createdAt,
      paths: [audit.frames.start, audit.frames.key, audit.frames.end, audit.reviewSheet, audit.reviewMarkdown],
      source_refs: [
        "production_system/reviews/local_identity_plates_2026-08-01/index.json",
        "production_system/reviews/local_video_source_frames_2026-08-01/index.md",
        "production_system/identity_lock_review_2026-07-31.json",
      ],
      depends_on: [
        "EP03-LOCAL-IDENTITY-PLATES-2026-08-01",
        "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
      ],
      risk_flags: ["local_asset_identity_unproven", "not_approved_for_video"],
      notes: audit.finding,
    });

    upsertBy(reviews.reviews, "review_id", {
      artifact_id: artifactId,
      review_id: `review-2026-08-01-${shotId}-local-asset-truth-audit`,
      reviewer_role: "pipeline-gate-qa-agent",
      reviewer: "codex",
      created_at: createdAt,
      decision: "blocked_needs_revision",
      blocking_issues: [audit.finding],
      required_revisions: [audit.requiredRevision],
      rubric: {
        local_asset_traceability: "partial",
        face_identity: "blocked_needs_revision",
        frame_chain: "layout_candidate_only",
        video_readiness: "blocked_needs_revision",
      },
      reviewed_paths: [audit.frames.start, audit.frames.key, audit.frames.end, audit.reviewSheet, audit.reviewMarkdown],
    });
  }

  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log("recorded EP03 local asset truth audit");
}

main();
