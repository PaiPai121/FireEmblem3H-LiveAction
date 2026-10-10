#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const goalMatrixPath = path.join(packageDir, "goal_completion_matrix.json");
const completionPath = path.join(packageDir, "video_generation_run_completion_audit.json");
const fullLocalReviewPath = path.join(packageDir, "full_local_visual_review.json");
const motionProbeReadyPath = path.join(packageDir, "motion_probe_submission_ready_gate.json");
const fullDurationReleasePath = path.join(packageDir, "full_duration_release_gate.json");
const reportFreshnessPath = path.join(packageDir, "report_freshness_gate.json");

function readJson(file, fallback = {}) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

const manifest = readJson(manifestPath, null);
if (!manifest) {
  throw new Error(`Missing package manifest: ${manifestPath}`);
}

const shots = Array.isArray(manifest.shots) ? manifest.shots : [];
const goalMatrix = readJson(goalMatrixPath);
const completion = readJson(completionPath);
const fullLocalReview = readJson(fullLocalReviewPath);
const motionProbeReady = readJson(motionProbeReadyPath);
const fullDurationRelease = readJson(fullDurationReleasePath);
const reportFreshness = readJson(reportFreshnessPath);

const statusCounts = {};
for (const shot of shots) {
  const review = fullLocalReview.shots?.[shot.shot] || {};
  shot.visual_review_status = review.status || shot.visual_review_status || "monitor_required";
  shot.video_generation_readiness = review.video_generation_readiness ||
    "monitor_required: submit short motion probe first; do not promote to approved_for_video until returned clips preserve identity, weapons, facing, and no-return roster state.";
  shot.decision = review.decision || shot.decision || "accepted_for_motion_probe_only_not_video_approved";
  shot.full_local_visual_review_status = review.status || shot.full_local_visual_review_status || "monitor_required";
  shot.fullLocalVisualReviewStatus = review.status || shot.fullLocalVisualReviewStatus || "monitor_required";
  shot.full_local_visual_review_decision = review.decision || shot.full_local_visual_review_decision || "accepted_for_motion_probe_only_not_video_approved";
  shot.fullLocalVisualReviewDecision = review.decision || shot.fullLocalVisualReviewDecision || "accepted_for_motion_probe_only_not_video_approved";
  if (shot.critical_reaudit) {
    shot.critical_reaudit.superseded_decision = shot.critical_reaudit.decision || "";
    shot.critical_reaudit.current_status = shot.status || "monitor_required";
    shot.critical_reaudit.current_decision = shot.decision;
    shot.critical_reaudit.decision = shot.decision;
    shot.critical_reaudit.required_followup = "submit_motion_probe_and_review_returned_clip_before_full_duration";
  }
  const status = shot.status || "(empty)";
  statusCounts[status] = (statusCounts[status] || 0) + 1;
}

const nonApprovedShots = shots
  .filter((shot) => shot.status !== "approved_for_video")
  .map((shot) => ({
    shot: shot.shot,
    status: shot.status || "(empty)",
    primary_check: shot.primary_check || "",
  }));

manifest.source_decision = goalMatrix.decision || "scene09_local_prompt_asset_goal_ready_video_clips_pending";
manifest.status = completion.decision || "video_generation_run_blocked_clips_pending";
manifest.current_phase = "clips_pending";
manifest.highest_completed_target = completion.highest_completed_target || "prompt_asset_package";
manifest.video_generation_run_state = {
  decision: completion.decision || "video_generation_run_blocked_clips_pending",
  passed_checks: Number(completion.passed_checks || 0),
  total_checks: Number(completion.total_checks || 0),
  failed_checks: Array.isArray(completion.failed_checks) ? completion.failed_checks : [],
  expected_clips: shots.length,
  ready_clips: 0,
  missing_clips: shots.length,
};
manifest.shot_status_summary = {
  status_counts: statusCounts,
  approved_for_video_shots: shots.filter((shot) => shot.status === "approved_for_video").length,
  non_approved_shots: nonApprovedShots.length,
  non_approved_reasons: {
    motion_probe_required: "Start/key/end frames and prompts are ready for monitored motion probes, but no shot is approved for final/full-duration video until returned probe clips pass signed review.",
    layout_reference: "Layout-reference shots require special attention in probe review and must not be treated as final visual approval.",
  },
  non_approved_shot_rows: nonApprovedShots,
};

manifest.execution_readiness = {
  ...(manifest.execution_readiness || {}),
  decision: "motion_probe_submission_ready_clips_pending",
  can_submit_motion_probe_to_provider: motionProbeReady.decision === "motion_probe_submission_ready",
  can_submit_to_provider: false,
  can_submit_full_duration_to_provider: false,
  can_claim_video_generation_package: false,
  can_claim_video_generation_run: false,
  expected_clips: shots.length,
  ready_clips: 0,
  missing_clips: shots.length,
  highest_completed_target: manifest.highest_completed_target,
  full_local_visual_review: fullLocalReview.decision || manifest.execution_readiness?.full_local_visual_review || "",
  motion_probe_submission_ready_gate: motionProbeReady.decision || manifest.execution_readiness?.motion_probe_submission_ready_gate || "",
  full_duration_release_gate: fullDurationRelease.decision || manifest.execution_readiness?.full_duration_release_gate || "",
  report_freshness_gate: reportFreshness.decision || manifest.execution_readiness?.report_freshness_gate || "",
  video_generation_run_completion: manifest.video_generation_run_state.decision,
  visual_readiness: "full_local_visual_review_passed_for_motion_probe_not_video_approved",
  motion_probe_submission: motionProbeReady.decision || "motion_probe_submission_ready",
  full_duration_submission: "blocked_until_42_returned_motion_probes_pass_signed_review",
};

if (manifest.critical_reaudit) {
  manifest.critical_reaudit.superseded_decision = "old_critical_reaudit_state";
  manifest.critical_reaudit.decision = "superseded_by_full_local_visual_review_motion_probe_ready";
  manifest.critical_reaudit.current_decision = fullLocalReview.decision || "full_local_visual_review_passed_for_motion_probe_not_video_approved";
  manifest.critical_reaudit.required_followup = "submit_motion_probe_and_review_returned_clip_before_full_duration";
}

manifest.updated_at = new Date().toISOString();

writeJson(manifestPath, manifest);

console.log(JSON.stringify({
  decision: "scene09_v3_current_manifest_status_normalized",
  package_manifest: path.relative(root, manifestPath),
  source_decision: manifest.source_decision,
  status: manifest.status,
  current_phase: manifest.current_phase,
  status_counts: statusCounts,
  non_approved_shots: nonApprovedShots.length,
}, null, 2));
