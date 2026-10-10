#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const projectRoot = path.join(repoRoot, "specials", "kakeya_byleth_lecture");
const today = "2026-07-27";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, rel), "utf8"));
}

function writeJson(rel, data) {
  fs.writeFileSync(path.join(projectRoot, rel), `${JSON.stringify(data, null, 2)}\n`);
}

const delivery = readJson("production_system/video_delivery_manifest.json");
delivery.status = "visual_blocked";
delivery.layout_reference_status = "layout_reference_only";
delivery.delivery_blocker = "Current start/key/end PNGs are rasterized layout boards, not genuine cinematic or storyboard keyframes. They show duplicated labels, information-card layout, and occasional text overlap, so they cannot be approved_for_video.";
delivery.package_note = "Use current PNG/SVG assets only as low-fidelity layout references. Real image-generation frames are pending.";
for (const shot of delivery.shots || []) {
  shot.status = "layout_reference";
  shot.review_status = "visual_blocked";
  shot.frame_status = "layout_reference_only";
  shot.layout_frame_status = "layout_reference";
  shot.model_notes = [
    "Do not submit current PNG directly as final video keyframe.",
    "Treat as a low-fidelity layout/reference board only.",
    "Generate real cinematic start/key/end frames from prompt.md and frame_spec.md before video package approval."
  ];
  shot.risk_flags = [...new Set([...(shot.risk_flags || []), "visual_blocked", "real_frames_pending"])].filter((flag) => flag !== "png_frames_available");
}
writeJson("production_system/video_delivery_manifest.json", delivery);

const pkg = readJson("prompt_asset_package_manifest.json");
pkg.status = "real_frames_pending";
pkg.frame_status = {
  layout_start_frames: "available_svg_png",
  layout_key_frames: "available_svg_png",
  layout_end_frames: "available_svg_png",
  cinematic_start_frames: "pending",
  cinematic_key_frames: "pending",
  cinematic_end_frames: "pending",
  clips: "blocked_until_real_frames"
};
pkg.notes = "Prompt asset package is complete. Current PNGs are rasterized layout boards only and are not approved cinematic/video keyframes. Real frame generation remains pending.";
writeJson("prompt_asset_package_manifest.json", pkg);

const artifactsDoc = readJson("production_system/artifact_manifest.json");
for (const artifact of artifactsDoc.artifacts || []) {
  if (/^KAK-BYLETH-PROMPT-SH\d{3}$/.test(artifact.id)) {
    artifact.status = "layout_reference";
    artifact.risk_flags = [...new Set([...(artifact.risk_flags || []), "visual_blocked", "real_frames_pending"])].filter((flag) => flag !== "png_frames_available");
    artifact.notes = artifact.notes.replace(/approved for storyboard\/diagrammatic video package\.?/, "current PNGs are layout references only; real cinematic frames pending.");
  }
  if (artifact.id === "KAK-BYLETH-PNG-FRAMESET") {
    artifact.status = "visual_blocked";
    artifact.risk_flags = [...new Set([...(artifact.risk_flags || []), "visual_blocked", "real_frames_pending"])];
    artifact.notes = "Actual PNG files exist, but they are rasterized layout boards with information-card composition and text overlap; not approved as video keyframes.";
  }
  if (artifact.id === "KAK-BYLETH-VIDEO-GENERATION-PACKAGE-INPUTS") {
    artifact.status = "blocked_needs_revision";
    artifact.risk_flags = [...new Set([...(artifact.risk_flags || []), "visual_blocked", "real_frames_pending"])];
    artifact.notes = "Blocked: immutable video package was built from layout-board PNGs and must not be treated as approved video-generation input.";
  }
}
writeJson("production_system/artifact_manifest.json", artifactsDoc);

const reviewsDoc = readJson("production_system/review_manifest.json");
for (const review of reviewsDoc.reviews || []) {
  if (review.review_id === "KAK-BYLETH-REVIEW-PNG-FRAMES-2026-07-27") {
    review.decision = "visual_blocked";
    review.blocking_issues = [
      "Current PNGs are rasterized layout boards, not generated cinematic/storyboard frames.",
      "Several frames contain visible UI/card composition and overlapping text.",
      "Frames cannot support approved_for_video status."
    ];
    review.required_revisions = [
      "Generate real start/key/end frames from the prompt package.",
      "Run visual review against shot purpose, identity, action peak, and mathematical locks before promotion."
    ];
    review.notes = "Corrective review supersedes earlier pass wording. Existing PNGs are low-fidelity layout references only.";
  }
  if (review.review_id === "KAK-BYLETH-REVIEW-VIDEO-INPUTS-2026-07-27") {
    review.decision = "blocked_needs_revision";
    review.blocking_issues = [
      "Video package inputs were built from layout-board PNGs instead of real generated frames."
    ];
    review.required_revisions = [
      "Replace current start/key/end PNGs with real image-generation frames.",
      "Rebuild delivery package only after visual and continuity review passes."
    ];
    review.notes = "Corrective review: package should not be submitted to a video model as-is.";
  }
}
reviewsDoc.reviews = (reviewsDoc.reviews || []).filter((review) => review.review_id !== "KAK-BYLETH-REVIEW-CORRECTIVE-FRAME-AUDIT-2026-07-27");
reviewsDoc.reviews.push({
  artifact_id: "KAK-BYLETH-PNG-FRAMESET",
  review_id: "KAK-BYLETH-REVIEW-CORRECTIVE-FRAME-AUDIT-2026-07-27",
  reviewer_role: "storyboard-qa-agent",
  reviewer: "codex-corrective-reviewer",
  created_at: today,
  decision: "visual_blocked",
  blocking_issues: [
    "The PNGs are browser screenshots of SVG layout boards, not purpose-built cinematic frames.",
    "They include page-like labels, duplicated text panels, and text overlap.",
    "They do not prove character performance, cinematic blocking, or video-ready action peaks."
  ],
  required_revisions: [
    "Use image generation for actual start/key/end frames.",
    "Keep the current PNGs only as layout_reference assets.",
    "Do not claim video_generation_package until real frames pass visual QA."
  ],
  rubric: {
    integrity: "pass",
    layout_reference: "pass",
    visual_storytelling: "fail",
    cinematic_readiness: "fail",
    mathematical_readability: "conditional",
    approval_status: "visual_blocked"
  },
  reviewed_paths: [
    "storyboards/SH007/key.png",
    "storyboards/SH016/key.png"
  ],
  notes: "Corrective audit prompted by user quality concern. The concern is valid."
});
writeJson("production_system/review_manifest.json", reviewsDoc);

fs.writeFileSync(path.join(projectRoot, "production_system", "reviews", "corrective_frame_audit_2026-07-27.md"), `# Corrective Frame Audit

Project ID: \`KAK-BYLETH-LECTURE\`
Review Date: 2026-07-27
Decision: \`visual_blocked\`

## Integrity / Gate Blockers

The frame files exist, but file existence was incorrectly treated as visual approval.

## Visual Audit Coverage

Audited visible PNG examples including SH007 key and SH016 key.

## Blocking Issues

- Current PNGs are rasterized SVG layout boards, not genuine generated cinematic frames.
- SH007 key and SH016 key show information-card composition rather than camera-framed shots.
- Text overlaps in the lower panels, which makes them unsuitable even as polished explanatory slides.
- They cannot support \`approved_for_video\` or \`video_generation_package\` claims.

## Required Revisions

Generate real start/key/end images from the existing prompt package, then run visual QA and continuity QA again. Keep current PNG/SVG files only as layout references.

## Decision

\`visual_blocked\`: the user's quality objection is valid.
`);

console.log("Corrected Kakeya Byleth frame status to visual_blocked/layout_reference.");
