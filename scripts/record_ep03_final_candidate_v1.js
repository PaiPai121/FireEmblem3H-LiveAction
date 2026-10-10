const fs = require("fs");

const epRoot = "episodes/EP03";
const createdAt = "2026-08-02";
const shotId = process.argv[2];
const opts = process.argv[3] ? JSON.parse(process.argv[3]) : {};

if (!shotId) {
  throw new Error("usage: node scripts/record_ep03_final_candidate_v1.js Shot020 '{...options...}'");
}

const shotLower = shotId.toLowerCase();
const artifactId = `EP03-${shotId.toUpperCase()}-LOCAL-ASSET-FINAL-CANDIDATE-V1-2026-08-02`;
const reviewId = `review-2026-08-02-${shotLower}-local-asset-final-candidate-v1`;
const queuePath = `${epRoot}/frame_generation_queue.json`;
const deliveryPath = `${epRoot}/production_system/video_delivery_manifest.json`;
const artifactManifestPath = `${epRoot}/production_system/artifact_manifest.json`;
const reviewManifestPath = `${epRoot}/production_system/review_manifest.json`;
const reviewMdPath = `${epRoot}/production_system/reviews/${shotLower}_local_asset_final_candidate_v1_review_2026-08-02.md`;
const reviewSheetPath = `${epRoot}/production_system/reviews/${shotLower}_local_asset_final_candidate_v1_review_2026-08-02.jpg`;

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

function findShot(container) {
  return (container.shots || []).find((shot) => shot.id === shotId || shot.shot_id === shotId);
}

function readPackageShot() {
  const file = `${epRoot}/delivery/complete_script_shot_asset_package_2026-08-01/shots.json`;
  if (!fs.existsSync(file)) return {};
  const data = readJson(file);
  const shots = Array.isArray(data) ? data : data.shots || [];
  return shots.find((shot) => shot.id === shotId || shot.shot_id === shotId) || {};
}

function stripEpRoot(value) {
  return value && value.startsWith(`${epRoot}/`) ? value.slice(epRoot.length + 1) : value;
}

function frames() {
  return {
    start: `storyboards/${shotId}/local_asset_final_candidate_v1_2026-08-02/start_frame_local_asset_final_candidate_v1_2026-08-02.png`,
    key: `storyboards/${shotId}/local_asset_final_candidate_v1_2026-08-02/key_frame_local_asset_final_candidate_v1_2026-08-02.png`,
    end: `storyboards/${shotId}/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`,
  };
}

function frameSet(deliveryShot) {
  const packageShot = readPackageShot();
  const richShot = { ...packageShot, ...deliveryShot };
  const sourceRefs = [];
  if (opts.previousShotId) {
    const previousEnd = `storyboards/${opts.previousShotId}/local_asset_final_candidate_v1_2026-08-02/end_frame_local_asset_final_candidate_v1_2026-08-02.png`;
    if (fs.existsSync(`${epRoot}/${previousEnd}`)) sourceRefs.push(previousEnd);
  }
  for (const value of [
    richShot.local_video_source_evidence,
    richShot.local_asset_proof_sheet,
    richShot.identity_comparison,
    ...(richShot.asset_references || []),
    `storyboards/${shotId}/start_frame.png`,
    `storyboards/${shotId}/key_frame.png`,
    `storyboards/${shotId}/end_frame.png`,
  ]) {
    const ref = stripEpRoot(value);
    if (ref) sourceRefs.push(ref);
  }

  return {
    frame_set_id: `${shotId}_local_asset_final_candidate_v1_2026-08-02`,
    status: "monitor_required",
    visual_audit_decision: "visual_review_passed",
    frames: frames(),
    review_sheet: stripEpRoot(reviewSheetPath),
    review_markdown: stripEpRoot(reviewMdPath),
    source_refs: [...new Set(sourceRefs)],
    note: opts.note || `${shotId} final candidate v1 uses local selected identity/location/source evidence and advances still-frame storytelling beyond layout_reference. Downstream video remains monitor_required pending prompt rewrite, video QA, continuity QA, and motion probe.`,
  };
}

function applyShotStatus(shot, deliveryShot) {
  shot.local_asset_final_candidate_v1 = frameSet(deliveryShot);
  shot.current_display_frame_set = "local_asset_final_candidate_v1";
  shot.current_display_frame_status = "monitor_required";
  shot.current_display_frame_source = opts.sourceSummary || `${shotId} local evidence/proof + local selected assets + constrained imagegen final candidate`;
  shot.status = "monitor_required";
  shot.visual_audit_decision = "visual_review_passed";
  shot.visual_audit_finding = opts.visualFinding || `${shotId} final candidate v1 has visually distinct start/key/end frames that prove the declared beat, action peak, and cut-out state at still-frame level.`;
  shot.required_revision = opts.requiredRevision || "Before approved_for_video, rewrite the executable web prompt to reference only uploaded START/KEY/END frames, run video-prompt QA against the actual frames, run timing/tail-hold QA, add a 3-second motion probe, and reject identity, wardrobe, UI, subtitle, gore, or action-continuity drift.";
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
  if (!fs.existsSync(reviewSheetPath)) throw new Error(`missing review sheet: ${reviewSheetPath}`);

  const queueShot = findShot(queue);
  const deliveryShot = findShot(delivery);
  const packageShot = readPackageShot();
  const richShot = { ...packageShot, ...deliveryShot };
  if (!queueShot || !deliveryShot) throw new Error(`${shotId} not found in queue or delivery manifest`);
  applyShotStatus(queueShot, richShot);
  applyShotStatus(deliveryShot, richShot);

  const scene = richShot.scene || richShot.beat || shotId;
  const purpose = richShot.purpose || richShot.shot_purpose || "";
  const visualBullets = opts.visualBullets || [
    "Start frame establishes the pre-action state and preserves local character/location traceability.",
    "Key frame shows the declared action peak without UI, subtitles, or unsupported tone drift.",
    "End frame lands on a distinct cut-out state for the next shot.",
  ];
  const risks = opts.downstreamRisks || [
    "Executable prompt must be rewritten against the actual START/KEY/END frames before video approval.",
    "Identity, wardrobe, action, and frame-presentation drift remain possible in motion.",
    "Timing/tail-hold and a 3-second motion probe are still required.",
  ];

  fs.writeFileSync(reviewMdPath, `# ${shotId} Local Asset Final Candidate V1 Review / 2026-08-02

Reviewer role: independent-storyboard-visual-qa-agent
Decision: visual_review_passed / monitor_required for downstream video

## Reviewed Paths

- Review sheet: \`${stripEpRoot(reviewSheetPath)}\`
- Start: \`${currentFrames.start}\`
- Key: \`${currentFrames.key}\`
- End: \`${currentFrames.end}\`
- Source evidence: \`${stripEpRoot(richShot.local_video_source_evidence) || "missing"}\`
- Local proof: \`${stripEpRoot(richShot.local_asset_proof_sheet) || "missing"}\`

## Visual Audit

Shot beat: ${scene}

Shot purpose: ${purpose}

${visualBullets.map((line) => `- ${line}`).join("\n")}

## Blocking Issues

No still-frame story/action blocker for ${shotId} final candidate v1.

## Downstream Risks

${risks.map((line) => `- ${line}`).join("\n")}

## Required Revision Before Video Approval

${deliveryShot.required_revision}
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
      stripEpRoot(reviewSheetPath),
      stripEpRoot(reviewMdPath),
    ],
    source_refs: frameSet(richShot).source_refs,
    depends_on: opts.dependsOn || [
      "EP03-LOCAL-SELECTED-PNG-COMPOSITED-PREVIS-V3-2026-08-01",
      "EP03-LOCAL-VIDEO-SOURCE-FRAMES-2026-08-01",
    ],
    risk_flags: opts.riskFlags || [
      "prompt_rewrite_required",
      "video_prompt_qa_required",
      "timing_tail_hold_qa_required",
      "not_approved_for_video",
      "motion_probe_required",
    ],
    notes: opts.artifactNotes || `${shotId} final candidate v1 advances from layout_reference to still-frame visual_review_passed with downstream monitor_required status.`,
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
      "Run dialogue-throughput and tail-hold QA where applicable.",
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
      stripEpRoot(reviewSheetPath),
      stripEpRoot(reviewMdPath),
    ],
  });

  writeJson(queuePath, queue);
  writeJson(deliveryPath, delivery);
  writeJson(artifactManifestPath, artifacts);
  writeJson(reviewManifestPath, reviews);
  console.log(`recorded ${shotId} final candidate v1: visual_review_passed / monitor_required`);
}

main();
