#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const manifestPath = path.join(packageDir, "package_manifest.json");
const siteDataPath = path.join(root, "site/ep02_storyboard_data.js");
const appPath = path.join(root, "site/app.js");
const outJson = path.join(reportDir, "scene09_v3_current_state_language_audit_2026-08-15.json");
const packageOutJson = path.join(packageDir, "current_state_language_audit.json");

const forbiddenCurrentSurfaceTerms = [
  "blocked_until_critical_reaudit_revisions_clear",
  "critical_reaudit_rebuild_pending_reviews",
  "blocked_until_p0_still_revisions",
  '"visual_readiness": "blocked_needs_revision"',
];

const allowedHistoricalTerms = [
  "superseded_decision",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function countMatches(text, term) {
  return text.split(term).length - 1;
}

const manifest = readJson(manifestPath);
const manifestText = fs.readFileSync(manifestPath, "utf8");
const siteText = fs.readFileSync(siteDataPath, "utf8");
const appText = fs.readFileSync(appPath, "utf8");
const shots = Array.isArray(manifest.shots) ? manifest.shots : [];
const statusCounts = {};
for (const shot of shots) {
  statusCounts[shot.status || "(empty)"] = (statusCounts[shot.status || "(empty)"] || 0) + 1;
}

const problems = [];
for (const term of forbiddenCurrentSurfaceTerms) {
  if (siteText.includes(term)) {
    problems.push(`site data leaks stale current-state term: ${term}`);
  }
  if (manifestText.includes(term)) {
    problems.push(`package manifest leaks stale current-state term: ${term}`);
  }
}

for (const term of allowedHistoricalTerms) {
  if (siteText.includes(term)) {
    problems.push(`site data should not expose historical status field: ${term}`);
  }
}

if (manifest.source_decision !== "scene09_local_prompt_asset_goal_ready_video_clips_pending") {
  problems.push(`source_decision is ${manifest.source_decision || "missing"}`);
}
if (manifest.status !== "video_generation_run_blocked_clips_pending") {
  problems.push(`status is ${manifest.status || "missing"}`);
}
if (manifest.current_phase !== "clips_pending") {
  problems.push(`current_phase is ${manifest.current_phase || "missing"}`);
}
if (manifest.execution_readiness?.decision !== "motion_probe_submission_ready_clips_pending") {
  problems.push(`execution_readiness.decision is ${manifest.execution_readiness?.decision || "missing"}`);
}
if (manifest.execution_readiness?.full_duration_submission !== "blocked_until_42_returned_motion_probes_pass_signed_review") {
  problems.push(`full_duration_submission is ${manifest.execution_readiness?.full_duration_submission || "missing"}`);
}
if (manifest.shot_status_summary?.non_approved_shots !== shots.length) {
  problems.push(`non_approved_shots is ${manifest.shot_status_summary?.non_approved_shots || 0}/${shots.length}`);
}
if (Number(manifest.shot_status_summary?.approved_for_video_shots || 0) !== 0) {
  problems.push(`approved_for_video_shots is ${manifest.shot_status_summary.approved_for_video_shots}, expected 0 before returned clips`);
}
if (!siteText.includes("accepted_for_motion_probe_only_not_video_approved")) {
  problems.push("site data does not expose accepted_for_motion_probe_only_not_video_approved");
}
if (!appText.includes("真实视频待生成") || !appText.includes("全时长未放行")) {
  problems.push("web renderer does not expose Chinese clips-pending/full-duration-lock status");
}

const result = {
  decision: problems.length ? "current_state_language_blocked" : "current_state_language_passed",
  package_manifest: path.relative(root, manifestPath),
  site_data: path.relative(root, siteDataPath),
  app: path.relative(root, appPath),
  shots: shots.length,
  status_counts: statusCounts,
  non_approved_shots: manifest.shot_status_summary?.non_approved_shots || 0,
  stale_historical_terms_in_manifest: Object.fromEntries(
    allowedHistoricalTerms.map((term) => [term, countMatches(manifestText, term)]),
  ),
  problems,
  report_json: path.relative(root, outJson),
  package_report_json: path.relative(root, packageOutJson),
};

writeJson(outJson, result);
writeJson(packageOutJson, result);
console.log(JSON.stringify(result, null, 2));
process.exit(problems.length ? 1 : 0);
