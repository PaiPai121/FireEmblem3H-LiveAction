#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const packageDir = "delivery/scene09_v3_monitor_handoff_package_2026-07-27";
const packageDirAbs = path.join(root, packageDir);
const reportDir = "production_system/scene09_v3_attrition_package";
const outJson = path.join(root, reportDir, "scene09_v3_web_submission_prompt_surface_audit_2026-08-04.json");
const outMd = path.join(root, reportDir, "scene09_v3_web_submission_prompt_surface_audit_2026-08-04.md");
const packageJson = path.join(packageDirAbs, "web_submission_prompt_surface_audit.json");
const packageMd = path.join(packageDirAbs, "web_submission_prompt_surface_audit.md");
const skipHandoffIndex = process.argv.includes("--skip-handoff-index");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function rel(file) {
  return path.relative(root, file);
}

function resolvePackageLink(value) {
  const text = String(value || "");
  if (!text) return "";
  if (text.startsWith(`${packageDir}/`)) return path.join(root, text);
  if (text.startsWith("shots/")) return path.join(packageDirAbs, text);
  return path.join(root, text);
}

function isPackageShotLink(value) {
  const text = String(value || "");
  return text.startsWith(`${packageDir}/shots/`) || text.startsWith("shots/");
}

function ep02Data() {
  const source = readText(path.join(root, "site/ep02_storyboard_data.js"))
    .replace(/^window\.EP02_STORYBOARD_DATA = /, "")
    .replace(/;\n?$/, "");
  return JSON.parse(source);
}

function isScene09(shot) {
  const match = String(shot.shot || "").match(/^Shot(\d+)/);
  const base = match ? Number(match[1]) : 0;
  return base >= 25 && base <= 36;
}

function hasWebFrameContract(text) {
  return ["uploaded START frame", "uploaded KEY frame", "uploaded END frame"]
    .every((phrase) => text.includes(phrase));
}

function forbiddenExecutableFragments(text) {
  const checks = [
    ["local path", /\/Users\//i],
    ["file URL", /file:\/\//i],
    ["http URL", /https?:\/\//i],
    ["episodes path", /\bepisodes\//i],
    ["delivery path", /\bdelivery\//i],
    ["production_system path", /\bproduction_system\//i],
    ["png filename", /\b[\w.-]+\.png\b/i],
    ["jpg filename", /\b[\w.-]+\.jpe?g\b/i],
    ["previous-shot dependency", /\b(continue from|same as|match the prior|match previous|previous shot|prior shot|last shot)\b/i],
  ];
  return checks.filter(([, regex]) => regex.test(text)).map(([label]) => label);
}

function main() {
  const problems = [];
  const warnings = [];
  const data = ep02Data();
  const packageManifest = readJson(path.join(packageDirAbs, "package_manifest.json"));
  const handoffHtml = fs.existsSync(path.join(packageDirAbs, "index.html"))
    ? readText(path.join(packageDirAbs, "index.html"))
    : "";
  const providerAudit = readJson(path.join(packageDirAbs, "provider_upload_bundles_audit.json"));
  const scene09Shots = (data.shots || []).filter(isScene09);
  const packageShots = packageManifest.shots || [];
  const rows = [];

  if (scene09Shots.length !== 42) problems.push(`main web Scene09 shot count ${scene09Shots.length}/42`);
  if (packageShots.length !== 42) problems.push(`package manifest shot count ${packageShots.length}/42`);
  if (providerAudit.decision !== "provider_upload_bundles_ready") {
    problems.push(`provider upload bundles audit is not ready: ${providerAudit.decision || "missing"}`);
  }
  if ((providerAudit.prompt_contract_files_checked || 0) !== 84) {
    problems.push(`provider prompt contract files checked ${(providerAudit.prompt_contract_files_checked || 0)}/84`);
  }

  for (const shot of scene09Shots) {
    const rowProblems = [];
    for (const [field, suffix] of [
      ["modelReadyPromptFile", "model_prompt.md"],
      ["modelReadyNegativePromptFile", "negative_prompt.md"],
      ["auditPromptFile", "prompt.md"],
      ["handoffShotMetadataFile", "metadata.json"],
    ]) {
      const value = shot[field] || "";
      if (!value) rowProblems.push(`${field} missing`);
      if (value && !isPackageShotLink(value)) rowProblems.push(`${field} is not package-local shot file: ${value}`);
      if (value && !value.endsWith(suffix)) rowProblems.push(`${field} does not end with ${suffix}: ${value}`);
      if (value && !fs.existsSync(resolvePackageLink(value))) rowProblems.push(`${field} target missing: ${value}`);
    }
    if (shot.promptSubmissionRole !== "model_prompt_md_submission_only") {
      rowProblems.push(`promptSubmissionRole mismatch: ${shot.promptSubmissionRole || "missing"}`);
    }
    if (shot.modelReadyPromptFile) {
      const promptText = readText(resolvePackageLink(shot.modelReadyPromptFile));
      if (!hasWebFrameContract(promptText)) rowProblems.push("model prompt missing uploaded START/KEY/END contract");
      const forbidden = forbiddenExecutableFragments(promptText);
      if (forbidden.length) rowProblems.push(`model prompt contains forbidden executable fragments: ${forbidden.join(", ")}`);
    }
    rows.push({
      shot: shot.shot,
      model_prompt: shot.modelReadyPromptFile || "",
      negative_prompt: shot.modelReadyNegativePromptFile || "",
      audit_prompt: shot.auditPromptFile || "",
      metadata: shot.handoffShotMetadataFile || "",
      problems: rowProblems,
    });
    problems.push(...rowProblems.map((problem) => `${shot.shot}: ${problem}`));
  }

  const handoffModelLabels = (handoffHtml.match(/model_prompt\.md（提交用，只引用上传 START\/KEY\/END）/g) || []).length;
  const handoffAuditLabels = (handoffHtml.match(/prompt\.md（审计原稿，不粘贴到网页模型）/g) || []).length;
  if (skipHandoffIndex) {
    if (handoffModelLabels !== 42) warnings.push(`handoff model_prompt submission labels not checked before index rebuild: ${handoffModelLabels}/42`);
    if (handoffAuditLabels !== 42) warnings.push(`handoff audit prompt labels not checked before index rebuild: ${handoffAuditLabels}/42`);
  } else {
    if (handoffModelLabels !== 42) problems.push(`handoff model_prompt submission labels ${handoffModelLabels}/42`);
    if (handoffAuditLabels !== 42) problems.push(`handoff audit prompt labels ${handoffAuditLabels}/42`);
  }

  const report = {
    date: "2026-08-04",
    decision: problems.length ? "web_submission_prompt_surface_failed" : "web_submission_prompt_surface_passed",
    scene09_shots_checked: scene09Shots.length,
    package_shots_checked: packageShots.length,
    handoff_index_checked: !skipHandoffIndex,
    handoff_model_prompt_submission_labels: handoffModelLabels,
    handoff_audit_prompt_labels: handoffAuditLabels,
    provider_upload_bundles_decision: providerAudit.decision || "missing",
    provider_prompt_contract_files_checked: providerAudit.prompt_contract_files_checked || 0,
    rows_with_model_ready_prompt_links: rows.filter((row) => row.model_prompt && row.negative_prompt && row.audit_prompt && row.metadata).length,
    problems,
    warnings,
    rows,
    production_report_json: rel(outJson),
    production_report_md: rel(outMd),
  };

  const md = [
    "# Scene09 V3 Web Submission Prompt Surface Audit",
    "",
    `Date: ${report.date}`,
    `Decision: ${report.decision}`,
    `Scene09 shots checked: ${report.scene09_shots_checked}`,
    `Rows with model-ready prompt links: ${report.rows_with_model_ready_prompt_links}`,
    `Handoff index checked: ${report.handoff_index_checked ? "yes" : "no"}`,
    `Handoff model_prompt labels: ${report.handoff_model_prompt_submission_labels}/42`,
    `Handoff audit prompt labels: ${report.handoff_audit_prompt_labels}/42`,
    `Provider prompt contract files checked: ${report.provider_prompt_contract_files_checked}/84`,
    "",
    "## Rule",
    "",
    "`model_prompt.md` is the only prompt text intended for web video model submission. `prompt.md` is retained as an audit/source trace file and must be labeled that way on review surfaces.",
    "",
    "## Problems",
    "",
    problems.length ? problems.map((problem) => `- ${problem}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    warnings.length ? warnings.map((warning) => `- ${warning}`).join("\n") : "- none",
    "",
  ].join("\n");

  writeJson(outJson, report);
  writeText(outMd, `${md}\n`);
  writeJson(packageJson, report);
  writeText(packageMd, `${md}\n`);
  console.log(JSON.stringify({
    decision: report.decision,
    scene09_shots_checked: report.scene09_shots_checked,
    rows_with_model_ready_prompt_links: report.rows_with_model_ready_prompt_links,
    handoff_index_checked: report.handoff_index_checked,
    provider_prompt_contract_files_checked: report.provider_prompt_contract_files_checked,
    problems: problems.length,
    warnings: warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageJson),
  }, null, 2));
  process.exit(problems.length ? 1 : 0);
}

main();
