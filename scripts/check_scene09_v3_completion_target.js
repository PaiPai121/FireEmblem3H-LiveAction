#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const root = process.cwd();
const packageDir = path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const skillChecker = path.join(
  process.env.HOME || "/Users/zekun",
  ".codex/skills/cinematic-production-pipeline/scripts/check_completion_target.js",
);
const completionPath = path.join(packageDir, "video_generation_run_completion_audit.json");
const manifestPath = path.join(packageDir, "package_manifest.json");
const finalOutput = path.join(root, "episodes/EP02/video_outputs/scene09_v3_attrition/scene09_v3_attrition_final_edit.mp4");
const reportDir = path.join(root, "production_system/scene09_v3_attrition_package");
const date = "2026-08-01";

const target = process.argv[2] || "video_generation_run";
const shouldWriteReport = process.argv.includes("--write-report");
const validTargets = new Set(["prompt_asset_package", "video_generation_package", "video_generation_run"]);

function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function runSkillTarget(skillTarget) {
  if (!fs.existsSync(skillChecker)) {
    return {
      ok: false,
      exit_code: null,
      missing: [`missing skill checker ${skillChecker}`],
      warnings: [],
      raw: null,
    };
  }
  const result = cp.spawnSync(process.execPath, [skillChecker, root, skillTarget], {
    cwd: root,
    encoding: "utf8",
  });
  let raw = null;
  try {
    raw = JSON.parse(result.stdout || "{}");
  } catch (error) {
    return {
      ok: false,
      exit_code: result.status,
      missing: [`skill checker returned non-JSON output for ${skillTarget}`],
      warnings: [error.message],
      raw: result.stdout || result.stderr || "",
    };
  }
  return {
    ok: raw.ok === true,
    exit_code: result.status,
    missing: Array.isArray(raw.missing) ? raw.missing : [],
    warnings: Array.isArray(raw.warnings) ? raw.warnings : [],
    raw,
  };
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function renderMarkdown(report) {
  return [
    `# Scene09 V3 Completion Target Check: ${report.target}`,
    "",
    `Decision: ${report.ok ? "passed" : "blocked"}`,
    `Highest completed target: ${report.highest_completed_target || (report.ok ? report.target : "unknown")}`,
    "",
    "## Package",
    "",
    `- Total shots: ${report.package?.total_shots ?? "unknown"}`,
    `- Monitor required shots: ${report.package?.monitor_required_shots ?? "unknown"}`,
    `- Monitor required after rebuild shots: ${report.package?.monitor_required_after_rebuild_shots ?? "unknown"}`,
    `- Layout reference shots: ${report.package?.layout_reference_shots ?? "unknown"}`,
    `- Approved for video shots: ${report.package?.approved_for_video_shots ?? "unknown"}`,
    `- Non-approved shots: ${report.package?.non_approved_shots ?? "unknown"}`,
    `- Expected clips existing: ${report.package?.expected_clips_existing ?? "unknown"}`,
    `- Expected clips missing: ${report.package?.expected_clips_missing ?? "unknown"}`,
    `- Status counts: ${JSON.stringify(report.package?.status_counts || {})}`,
    "",
    "## Non-Approved Shot Rows",
    "",
    report.package?.non_approved_shot_rows?.length
      ? report.package.non_approved_shot_rows.map((row) => `- ${row.shot}: ${row.status}${row.primary_check ? ` - ${row.primary_check}` : ""}`).join("\n")
      : "- none",
    "",
    "## Completion",
    "",
    report.completion
      ? [
          `- Decision: ${report.completion.decision || "unknown"}`,
          `- Checks: ${report.completion.passed_checks}/${report.completion.total_checks}`,
          `- Failed checks: ${report.completion.failed_checks?.join(", ") || "none"}`,
        ].join("\n")
      : "- Not applicable.",
    "",
    "## Missing",
    "",
    report.missing?.length ? report.missing.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    report.warnings?.length ? report.warnings.map((item) => `- ${item}`).join("\n") : "- none",
    "",
  ].join("\n");
}

function writeReport(report) {
  const base = `scene09_v3_completion_target_${report.target}_${date}`;
  const productionJson = path.join(reportDir, `${base}.json`);
  const productionMd = path.join(reportDir, `${base}.md`);
  const packageJson = path.join(packageDir, `completion_target_${report.target}.json`);
  const packageMd = path.join(packageDir, `completion_target_${report.target}.md`);
  const withReports = {
    ...report,
    report_json: path.relative(root, productionJson),
    package_report_json: path.relative(root, packageJson),
  };
  writeJson(productionJson, withReports);
  writeJson(packageJson, withReports);
  writeText(productionMd, renderMarkdown(withReports));
  writeText(packageMd, renderMarkdown(withReports));
  return withReports;
}

function packageSummary() {
  const manifest = readJson(manifestPath, { shots: [] });
  const shots = Array.isArray(manifest.shots) ? manifest.shots : [];
  const statusCounts = {};
  for (const shot of shots) {
    const status = shot.status || "(empty)";
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  }
  const nonApprovedShotRows = shots
    .filter((shot) => shot.status !== "approved_for_video")
    .map((shot) => ({
      shot: shot.shot,
      status: shot.status || "(empty)",
      primary_check: shot.primary_check || "",
    }));
  const expectedClipRows = shots.map((shot) => ({
    shot: shot.shot,
    expected_clip: shot.expected_clip,
    exists: Boolean(shot.expected_clip && fs.existsSync(path.join(root, shot.expected_clip))),
  }));
  return {
    package_manifest: path.relative(root, manifestPath),
    total_shots: Number(manifest.total_shots || shots.length || 0),
    status_counts: statusCounts,
    monitor_required_shots: shots.filter((shot) => shot.status === "monitor_required").length,
    monitor_required_after_rebuild_shots: shots.filter((shot) => shot.status === "monitor_required_after_rebuild").length,
    layout_reference_shots: shots.filter((shot) => shot.status === "layout_reference").length,
    approved_for_video_shots: shots.filter((shot) => shot.status === "approved_for_video").length,
    non_approved_shots: nonApprovedShotRows.length,
    non_approved_shot_rows: nonApprovedShotRows,
    expected_clips_existing: expectedClipRows.filter((row) => row.exists).length,
    expected_clips_missing: expectedClipRows.filter((row) => !row.exists).length,
  };
}

function checkVideoGenerationRun() {
  const prompt = runSkillTarget("prompt_asset_package");
  const videoPackage = runSkillTarget("video_generation_package");
  const completion = readJson(completionPath, {});
  const summary = packageSummary();
  const failedChecks = Array.isArray(completion.failed_checks) ? completion.failed_checks : [];
  const missing = [];

  if (!prompt.ok) missing.push("prompt_asset_package is not complete");
  if (videoPackage.ok !== true) missing.push("video_generation_package is not complete");
  if (completion.decision !== "video_generation_run_complete") {
    missing.push(`completion decision is ${completion.decision || "missing"}, not video_generation_run_complete`);
  }
  if (Number(completion.passed_checks || 0) !== Number(completion.total_checks || 0) || Number(completion.total_checks || 0) === 0) {
    missing.push(`completion checks are ${completion.passed_checks || 0}/${completion.total_checks || 0}`);
  }
  for (const check of failedChecks) missing.push(`failed completion check: ${check}`);
  if (!fs.existsSync(finalOutput)) missing.push(`missing final edit ${path.relative(root, finalOutput)}`);
  if (!process.env.VIDEO_MODEL_CLI_ARGV_JSON) missing.push("VIDEO_MODEL_CLI_ARGV_JSON is not configured");

  return {
    target: "video_generation_run",
    ok: missing.length === 0,
    highest_completed_target: completion.highest_completed_target || (prompt.ok ? "prompt_asset_package" : "below_prompt_asset_package"),
    project_root: root,
    package: summary,
    completion: {
      decision: completion.decision || null,
      passed_checks: Number(completion.passed_checks || 0),
      total_checks: Number(completion.total_checks || 0),
      failed_checks: failedChecks,
      report: fs.existsSync(completionPath) ? path.relative(root, completionPath) : null,
    },
    upstream_targets: {
      prompt_asset_package: prompt.ok,
      video_generation_package: videoPackage.ok,
    },
    missing,
    warnings: [
      ...prompt.warnings.map((warning) => `prompt_asset_package: ${warning}`),
      ...videoPackage.warnings.map((warning) => `video_generation_package: ${warning}`),
    ],
  };
}

function main() {
  if (!validTargets.has(target)) {
    console.error(`usage: check_scene09_v3_completion_target.js [${[...validTargets].join("|")}]`);
    process.exit(2);
  }

  let report;
  if (target === "video_generation_run") {
    report = checkVideoGenerationRun();
  } else {
    const result = runSkillTarget(target);
    report = {
      target,
      ok: result.ok,
      project_root: root,
      package: packageSummary(),
      missing: result.missing,
      warnings: result.warnings,
      upstream: result.raw,
    };
  }

  if (shouldWriteReport) report = writeReport(report);
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 1);
}

main();
