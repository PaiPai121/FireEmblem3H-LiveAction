#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const date = "2026-08-01";
const packageDir = process.env.SCENE09_V3_PACKAGE_DIR
  ? path.resolve(process.env.SCENE09_V3_PACKAGE_DIR)
  : path.join(root, "delivery/scene09_v3_monitor_handoff_package_2026-07-27");
const manifestPath = path.join(packageDir, "package_manifest.json");
const reportDir = process.env.SCENE09_V3_REPORT_DIR
  ? path.resolve(process.env.SCENE09_V3_REPORT_DIR)
  : path.join(root, "production_system/scene09_v3_attrition_package");
const outJson = path.join(reportDir, `scene09_v3_model_cli_template_audit_${date}.json`);
const outMd = path.join(reportDir, `scene09_v3_model_cli_template_audit_${date}.md`);
const packageOutJson = path.join(packageDir, "model_cli_template_audit.json");
const packageOutMd = path.join(packageDir, "model_cli_template_audit.md");

const SUPPORTED_PLACEHOLDERS = new Set([
  "shot_id",
  "shot",
  "order",
  "duration",
  "prompt",
  "model_prompt",
  "audit_prompt",
  "negative_prompt",
  "start_frame",
  "key_frame",
  "end_frame",
  "output",
]);

const REQUIRED_GROUPS = [
  { id: "prompt", label: "model prompt", anyOf: ["prompt", "model_prompt"] },
  { id: "negative_prompt", label: "negative prompt", anyOf: ["negative_prompt"] },
  { id: "start_frame", label: "start frame", anyOf: ["start_frame"] },
  { id: "key_frame", label: "key frame", anyOf: ["key_frame"] },
  { id: "end_frame", label: "end frame", anyOf: ["end_frame"] },
  { id: "duration", label: "duration", anyOf: ["duration"] },
  { id: "output", label: "output mp4 path", anyOf: ["output"] },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
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

function placeholdersIn(argv) {
  const found = new Set();
  const unknown = [];
  for (const arg of argv) {
    for (const match of String(arg).matchAll(/\{([a-z_]+)\}/g)) {
      const key = match[1];
      found.add(key);
      if (!SUPPORTED_PLACEHOLDERS.has(key)) unknown.push(`{${key}}`);
    }
  }
  return { found, unknown: [...new Set(unknown)] };
}

function resolveShotDir(shot) {
  return path.join(packageDir, shot.package_dir);
}

function sampleValues(shot) {
  const shotDir = resolveShotDir(shot);
  return {
    shot_id: shot.id,
    shot: shot.shot,
    order: String(shot.order),
    duration: String(shot.duration_seconds || ""),
    prompt: path.join(shotDir, "model_prompt.md"),
    model_prompt: path.join(shotDir, "model_prompt.md"),
    audit_prompt: path.join(shotDir, "prompt.md"),
    negative_prompt: path.join(shotDir, "negative_prompt.md"),
    start_frame: path.join(shotDir, "start_frame.png"),
    key_frame: path.join(shotDir, "key_frame.png"),
    end_frame: path.join(shotDir, "end_frame.png"),
    output: path.join(root, shot.expected_clip),
  };
}

function renderSample(argv, values) {
  return argv.map((arg) => arg.replace(/\{([a-z_]+)\}/g, (match, key) => values[key] ?? match));
}

function auditTemplate(raw, manifest) {
  const problems = [];
  const warnings = [];
  const checks = [];
  const firstShot = [...(manifest.shots || [])].sort((a, b) => Number(a.order) - Number(b.order))[0];

  if (!raw) {
    return {
      configured: false,
      can_execute_with_local_cli: false,
      decision: "model_cli_template_not_configured",
      problems,
      warnings: ["VIDEO_MODEL_CLI_ARGV_JSON is not configured; provider upload and external generation remain the current path."],
      checks,
      argv_template: null,
      sample_command_argv: null,
    };
  }

  let argv;
  try {
    argv = JSON.parse(raw);
  } catch (error) {
    problems.push(`VIDEO_MODEL_CLI_ARGV_JSON is not valid JSON: ${error.message}`);
    return {
      configured: true,
      can_execute_with_local_cli: false,
      decision: "model_cli_template_blocked",
      problems,
      warnings,
      checks,
      argv_template: null,
      sample_command_argv: null,
    };
  }

  if (!Array.isArray(argv) || argv.length === 0 || argv.some((item) => typeof item !== "string")) {
    problems.push("VIDEO_MODEL_CLI_ARGV_JSON must be a non-empty JSON array of strings.");
    return {
      configured: true,
      can_execute_with_local_cli: false,
      decision: "model_cli_template_blocked",
      problems,
      warnings,
      checks,
      argv_template: argv,
      sample_command_argv: null,
    };
  }

  if (/^\{[a-z_]+\}$/.test(argv[0])) {
    problems.push("The executable position argv[0] must be a concrete command, not a placeholder.");
  }

  const placeholderInfo = placeholdersIn(argv);
  for (const unknown of placeholderInfo.unknown) {
    problems.push(`Unsupported placeholder in VIDEO_MODEL_CLI_ARGV_JSON: ${unknown}`);
  }

  for (const group of REQUIRED_GROUPS) {
    const present = group.anyOf.some((key) => placeholderInfo.found.has(key));
    checks.push({
      id: group.id,
      label: group.label,
      required_placeholders: group.anyOf.map((key) => `{${key}}`),
      passed: present,
    });
    if (!present) {
      problems.push(`Missing required ${group.label} placeholder: ${group.anyOf.map((key) => `{${key}}`).join(" or ")}`);
    }
  }

  if (!placeholderInfo.found.has("audit_prompt")) {
    warnings.push("Template does not include {audit_prompt}; this is acceptable only if the model runner does not need the full review contract.");
  }
  if (!placeholderInfo.found.has("shot_id") && !placeholderInfo.found.has("shot") && !placeholderInfo.found.has("order")) {
    warnings.push("Template has no shot identity placeholder; logging and provider traceability may be weaker.");
  }

  const sample = firstShot ? renderSample(argv, sampleValues(firstShot)) : null;
  const sampleText = sample ? sample.join("\n") : "";
  if (sample && /\{[a-z_]+\}/.test(sampleText)) {
    problems.push("Sample command still contains unreplaced placeholders after rendering.");
  }

  return {
    configured: true,
    can_execute_with_local_cli: problems.length === 0,
    decision: problems.length ? "model_cli_template_blocked" : "model_cli_template_ready",
    problems,
    warnings,
    checks,
    argv_template: argv,
    placeholders_found: [...placeholderInfo.found].sort().map((key) => `{${key}}`),
    sample_shot: firstShot ? { order: firstShot.order, shot: firstShot.shot, id: firstShot.id } : null,
    sample_command_argv: sample,
  };
}

function main() {
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing package manifest: ${manifestPath}`);
  const manifest = readJson(manifestPath);
  const audit = auditTemplate(process.env.VIDEO_MODEL_CLI_ARGV_JSON, manifest);
  const report = {
    date,
    package_manifest: rel(manifestPath),
    package_id: manifest.package_id,
    target_stage: "video_generation_run",
    ...audit,
  };

  writeJson(outJson, report);
  writeJson(packageOutJson, report);
  const md = [
    "# Scene09 V3 Model CLI Template Audit",
    "",
    `Date: ${date}`,
    `Decision: ${report.decision}`,
    `Configured: ${report.configured ? "yes" : "no"}`,
    `Can execute with local CLI: ${report.can_execute_with_local_cli ? "yes" : "no"}`,
    "",
    "## Required Placeholders",
    "",
    ...REQUIRED_GROUPS.map((group) => {
      const check = (report.checks || []).find((item) => item.id === group.id);
      const status = check?.passed ? "PASS" : report.configured ? "FAIL" : "PENDING";
      return `- ${status} ${group.label}: ${group.anyOf.map((key) => `{${key}}`).join(" or ")}`;
    }),
    "",
    "## Problems",
    "",
    report.problems.length ? report.problems.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Warnings",
    "",
    report.warnings.length ? report.warnings.map((item) => `- ${item}`).join("\n") : "- none",
    "",
    "## Sample Command",
    "",
    report.sample_command_argv ? "```text\n" + report.sample_command_argv.join(" ") + "\n```" : "- none; VIDEO_MODEL_CLI_ARGV_JSON is not configured.",
    "",
  ].join("\n");
  writeText(outMd, md);
  writeText(packageOutMd, md);

  console.log(JSON.stringify({
    decision: report.decision,
    configured: report.configured,
    can_execute_with_local_cli: report.can_execute_with_local_cli,
    problems: report.problems.length,
    warnings: report.warnings.length,
    report_json: rel(outJson),
    package_report_json: rel(packageOutJson),
  }, null, 2));

  if (report.configured && !report.can_execute_with_local_cli) process.exit(1);
}

main();
