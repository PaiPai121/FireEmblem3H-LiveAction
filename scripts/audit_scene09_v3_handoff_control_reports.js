#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const date = "2026-08-04";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");

const manifestPath = path.join(packageDir, "package_manifest.json");
const packageOutJson = path.join(packageDir, "handoff_control_reports_audit.json");
const packageOutMd = path.join(packageDir, "handoff_control_reports_audit.md");
const reportOutJson = path.join(reportDir, `scene09_v3_handoff_control_reports_audit_${date}.json`);
const reportOutMd = path.join(reportDir, `scene09_v3_handoff_control_reports_audit_${date}.md`);

const EXPECTED_REPORTS = [
  "motion_probe_package_audit.json",
  "motion_probe_provider_bundles_audit.json",
  "motion_probe_submission_ready_gate.json",
  "motion_probe_operator_tracker.json",
  "motion_probe_operator_tracker_audit.json",
  "motion_probe_return_intake_audit.json",
  "motion_probe_return_roundtrip_audit.json",
  "full_local_visual_review.json",
  "full_duration_release_gate.json",
  "operator_preflight_status.json",
  "OPERATOR_NEXT_STEPS.json",
];

const EXPECTED_DECISIONS = {
  motion_probe_package_audit: ["motion_probe_package_ready"],
  motion_probe_provider_bundles_audit: ["motion_probe_provider_bundles_ready"],
  motion_probe_submission_ready_gate: ["motion_probe_submission_ready"],
  motion_probe_operator_tracker: ["motion_probe_operator_tracker_ready_clips_pending", "motion_probe_operator_tracker_complete"],
  motion_probe_operator_tracker_audit: ["motion_probe_operator_tracker_audit_passed"],
  motion_probe_return_intake_audit: ["motion_probe_return_intake_ready"],
  motion_probe_return_roundtrip_audit: ["motion_probe_return_roundtrip_passed"],
  full_local_visual_review: ["full_local_visual_review_passed_for_motion_probe_not_video_approved"],
  full_duration_release_gate: ["full_duration_release_blocked_probe_review_pending", "full_duration_release_passed"],
  operator_preflight_status: ["full_duration_release_pending_probe_review", "ready_for_full_duration_provider_submission"],
  OPERATOR_NEXT_STEPS: ["clips_pending", "ready_for_full_duration_provider_submission", "video_generation_run_complete"],
};

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function writeJson(file, value) {
  writeText(file, `${JSON.stringify(value, null, 2)}\n`);
}

function rel(file) {
  return path.relative(root, file);
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function basenameId(file) {
  return path.basename(file, ".json");
}

function countProblems(report) {
  return Array.isArray(report?.problems) ? report.problems.length : 0;
}

function countWarnings(report) {
  return Array.isArray(report?.warnings) ? report.warnings.length : 0;
}

function declaredDecisionMatches(actual, expected) {
  if (!expected) return true;
  if (expected.endsWith("_or_complete")) {
    const base = expected.replace("_or_complete", "");
    return actual === base || actual === `${base.replace(/_clips_pending$/, "")}_complete`;
  }
  if (expected.endsWith("_or_passed")) {
    const base = expected.replace("_or_passed", "");
    return actual === base || actual.endsWith("_passed");
  }
  return actual === expected;
}

const problems = [];
const warnings = [];
const manifest = readJson(manifestPath, {});
const expectedShots = Number(manifest.total_shots || 42);
const control = manifest.handoff_control_reports || {};
const declaredReports = Array.isArray(control.required_reports) ? control.required_reports : [];
const declaredDecisions = control.required_decisions || {};

if (!control || typeof control !== "object" || !declaredReports.length) {
  problems.push("package_manifest.handoff_control_reports is missing or empty");
}

for (const expected of EXPECTED_REPORTS) {
  if (!declaredReports.includes(expected)) problems.push(`handoff_control_reports missing required report ${expected}`);
}
for (const declared of declaredReports) {
  if (!EXPECTED_REPORTS.includes(declared)) warnings.push(`handoff_control_reports has extra report ${declared}`);
}

const rows = [];
for (const file of EXPECTED_REPORTS) {
  const abs = path.join(packageDir, file);
  const id = basenameId(file);
  const report = readJson(abs, null);
  const rowProblems = [];
  const rowWarnings = [];
  const declaredDecision = declaredDecisions[id] || "";
  if (!fs.existsSync(abs)) {
    rowProblems.push(`missing ${file}`);
  }
  if (!report) {
    rowProblems.push(`unreadable json ${file}`);
  }
  const actualDecision = report?.decision || report?.current_phase || report?.status || "";
  const acceptedDecisions = EXPECTED_DECISIONS[id] || [];
  if (report && acceptedDecisions.length && !acceptedDecisions.includes(actualDecision)) {
    rowProblems.push(`decision ${actualDecision || "missing"} is not accepted (${acceptedDecisions.join(", ")})`);
  }
  if (report && declaredDecision && !declaredDecisionMatches(actualDecision, declaredDecision)) {
    rowProblems.push(`manifest required decision ${declaredDecision} does not match actual ${actualDecision || "missing"}`);
  }
  if (report && countProblems(report) !== 0) {
    if (id === "full_duration_release_gate" && actualDecision === "full_duration_release_blocked_probe_review_pending") {
      rowWarnings.push(`blocked by pending probes with ${countProblems(report)} problems`);
    } else {
      rowProblems.push(`report carries ${countProblems(report)} problems`);
    }
  }
  if (report && ["motion_probe_package_audit", "motion_probe_provider_bundles_audit"].includes(id)) {
    if (Number(report.rows_checked || 0) !== expectedShots) rowProblems.push(`rows_checked ${report.rows_checked || 0} does not match ${expectedShots}`);
  }
  if (report && id === "motion_probe_submission_ready_gate") {
    if (Number(report.bundled_probe_rows || 0) !== expectedShots) rowProblems.push(`bundled_probe_rows ${report.bundled_probe_rows || 0} does not match ${expectedShots}`);
    if (Number(report.unique_probe_custom_ids || 0) !== expectedShots) rowProblems.push(`unique_probe_custom_ids ${report.unique_probe_custom_ids || 0} does not match ${expectedShots}`);
    if (Number(report.provider_zip_count || 0) !== 7) rowProblems.push(`provider_zip_count ${report.provider_zip_count || 0} is not 7`);
    if (Number(report.return_batches || 0) !== 7) rowProblems.push(`return_batches ${report.return_batches || 0} is not 7`);
    if (report.full_duration_release?.can_release_full_duration === true) rowProblems.push("full-duration release is unlocked before probe submission");
  }
  if (report && ["motion_probe_operator_tracker", "motion_probe_operator_tracker_audit", "motion_probe_return_intake_audit"].includes(id)) {
    if (Number(report.expected_probe_rows || 0) !== expectedShots) rowProblems.push(`expected_probe_rows ${report.expected_probe_rows || 0} does not match ${expectedShots}`);
  }
  if (report && id === "motion_probe_provider_bundles_audit" && Number(report.bundles_checked || 0) !== 7) {
    rowProblems.push(`bundles_checked ${report.bundles_checked || 0} is not 7`);
  }
  if (report && id === "motion_probe_operator_tracker_audit") {
    if (Number(report.csv_rows || 0) !== expectedShots) rowProblems.push(`csv_rows ${report.csv_rows || 0} does not match ${expectedShots}`);
    if (Number(report.unique_custom_ids || 0) !== expectedShots) rowProblems.push(`unique_custom_ids ${report.unique_custom_ids || 0} does not match ${expectedShots}`);
  }
  if (report && id === "full_duration_release_gate") {
    if (Number(report.expected_probe_clips || 0) !== expectedShots) rowProblems.push(`expected_probe_clips ${report.expected_probe_clips || 0} does not match ${expectedShots}`);
    if (actualDecision === "full_duration_release_passed" && report.can_release_full_duration !== true) {
      rowProblems.push("full_duration_release_passed without can_release_full_duration=true");
    }
  }
  if (report && id === "full_local_visual_review") {
    const integrity = report.integrity_summary || {};
    const coverage = report.visual_audit_coverage || {};
    const reviewedShots = report.shots && typeof report.shots === "object" ? Object.keys(report.shots) : [];
    if (Number(integrity.shots_reviewed || 0) !== expectedShots) rowProblems.push(`shots_reviewed ${integrity.shots_reviewed || 0} does not match ${expectedShots}`);
    if (Number(integrity.frames_present || 0) !== expectedShots * 3) rowProblems.push(`frames_present ${integrity.frames_present || 0} does not match ${expectedShots * 3}`);
    if (Array.isArray(integrity.missing_frame_refs) && integrity.missing_frame_refs.length) rowProblems.push(`missing_frame_refs ${integrity.missing_frame_refs.length}`);
    if (!Array.isArray(coverage.monitor_required) || coverage.monitor_required.length !== expectedShots) rowProblems.push(`monitor_required ${coverage.monitor_required?.length || 0} does not match ${expectedShots}`);
    if (Array.isArray(coverage.visual_review_passed) && coverage.visual_review_passed.length) rowProblems.push(`visual_review_passed ${coverage.visual_review_passed.length} should remain 0 before returned probes`);
    if (reviewedShots.length !== expectedShots) rowProblems.push(`reviewed shot entries ${reviewedShots.length} does not match ${expectedShots}`);
    if (!String(report.promotion_decision || "").includes("Do not submit full-duration video yet")) {
      rowProblems.push("promotion_decision does not explicitly block full-duration approval");
    }
  }
  if (report && id === "operator_preflight_status") {
    const counts = report.evidence?.clip_status || {};
    if (Number(counts.expected_clips || 0) !== expectedShots) rowProblems.push(`operator expected_clips ${counts.expected_clips || 0} does not match ${expectedShots}`);
    if (report.can_submit_to_provider === true && report.can_claim_video_generation_package !== true) {
      rowProblems.push("operator can_submit_to_provider=true but can_claim_video_generation_package is not true");
    }
  }
  if (report && id === "OPERATOR_NEXT_STEPS") {
    if (Number(report.counts?.expected_probe_clips || 0) !== expectedShots) rowProblems.push(`next steps expected_probe_clips ${report.counts?.expected_probe_clips || 0} does not match ${expectedShots}`);
    if (!report.required_links?.motion_probe_operator_tracker_audit) rowProblems.push("next steps missing motion_probe_operator_tracker_audit required link");
  }
  rows.push({
    id,
    file,
    exists: fs.existsSync(abs),
    decision: actualDecision,
    declared_decision: declaredDecision,
    problems: rowProblems,
    warnings: rowWarnings,
    sha256: fs.existsSync(abs) ? sha256(abs) : null,
  });
  problems.push(...rowProblems.map((item) => `${id}: ${item}`));
  warnings.push(...rowWarnings.map((item) => `${id}: ${item}`));
}

const decision = problems.length
  ? "handoff_control_reports_audit_blocked"
  : "handoff_control_reports_audit_passed";
const result = {
  date,
  decision,
  package_manifest: rel(manifestPath),
  expected_shots: expectedShots,
  required_reports_checked: rows.length,
  declared_required_reports: declaredReports.length,
  rows,
  problems,
  warnings,
};

const md = [
  "# Scene09 Handoff Control Reports Audit",
  "",
  `Decision: ${decision}`,
  `Required reports checked: ${rows.length}`,
  `Declared required reports: ${declaredReports.length}`,
  "",
  "## Rows",
  ...rows.map((row) => `- ${row.id}: ${row.decision || "missing"}; problems ${row.problems.length}; warnings ${row.warnings.length}`),
  "",
  "## Problems",
  problems.length ? problems.map((item) => `- ${item}`).join("\n") : "- none",
  "",
  "## Warnings",
  warnings.length ? warnings.map((item) => `- ${item}`).join("\n") : "- none",
  "",
].join("\n");

writeJson(packageOutJson, result);
writeText(packageOutMd, md);
writeJson(reportOutJson, result);
writeText(reportOutMd, md);

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (problems.length) process.exit(1);
